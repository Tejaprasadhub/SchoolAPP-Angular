import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingHttpInterceptorComponent } from './loading-http-interceptor.component';

describe('LoadingHttpInterceptorComponent', () => {
  let component: LoadingHttpInterceptorComponent;
  let fixture: ComponentFixture<LoadingHttpInterceptorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingHttpInterceptorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingHttpInterceptorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
