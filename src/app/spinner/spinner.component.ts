import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingHttpInterceptor } from '../core/loading-http-interceptor/loading-http-interceptor.component';
import { Subscription, observable, Observable, timer } from 'rxjs';

import { debounce } from 'rxjs/operators';




@Component({
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnDestroy {
  private subsription: Subscription;
  public visible: boolean;
  private debounceDelay = 0;


  constructor(private loadingHttpInterceptor: LoadingHttpInterceptor) {
    this.subsription = this.loadingHttpInterceptor
      .anyRequestsLoading
      .pipe(debounce(this.handleDebounce.bind(this)))
      .subscribe(anyRequestLoading => {
        this.visible = anyRequestLoading;
      });
  }

  ngOnInit(): void {
    // console.log(this.visible);
  }

  ngOnDestroy(): void {
    this.subsription.unsubscribe();
  }
  private handleDebounce(anyRequestLoading: boolean): Observable<number> {
    if (anyRequestLoading) {
      return timer(this.debounceDelay)
    }
    return timer(0);
  }

}
