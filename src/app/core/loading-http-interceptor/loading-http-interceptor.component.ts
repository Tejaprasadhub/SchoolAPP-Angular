import { Component, OnInit, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, ReplaySubject, observable, throwError as observableThrowError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';



@Injectable()
export class LoadingHttpInterceptor implements HttpInterceptor {
  private requests = 0;
  public anyRequestsLoading: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  constructor() { }
  get LoadingRequestsStatus(): Observable<boolean> {
    return this.anyRequestsLoading.asObservable();
  }
  get loadingRequests(): number {
    return this.requests;
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.indexOf('background=true') > 0 || (req.urlWithParams && req.urlWithParams.indexOf('background=true') > 0)) {
      return next.handle(req);
    }
    this.requests++;
    if (this.requests == 1) {
      this.anyRequestsLoading.next(true);
    }

    return next.handle(req).pipe(
      map(event => {
        return event;
      }),
      catchError(error => {
        return observableThrowError(error);
      }),
      finalize(() => {
        this.requests--;
        if (this.requests == 0) {
          this.anyRequestsLoading.next(false);
        }
      })
    );
  }
}

export function LoadingHttpInterceptorFactory() {
  return new LoadingHttpInterceptor();
}

export let LoadingHttpInterceptorFactoryProvider = {
  provide: LoadingHttpInterceptor,
  useFactory: LoadingHttpInterceptorFactory
}
