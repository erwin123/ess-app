import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainAccountComponent } from './maintain-account.component';

describe('MaintainAccountComponent', () => {
  let component: MaintainAccountComponent;
  let fixture: ComponentFixture<MaintainAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
