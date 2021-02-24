import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedroutingComponent } from './sharedrouting.component';

describe('SharedroutingComponent', () => {
  let component: SharedroutingComponent;
  let fixture: ComponentFixture<SharedroutingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedroutingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedroutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
