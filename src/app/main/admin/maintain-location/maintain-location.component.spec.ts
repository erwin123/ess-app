import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainLocationComponent } from './maintain-location.component';

describe('MaintainLocationComponent', () => {
  let component: MaintainLocationComponent;
  let fixture: ComponentFixture<MaintainLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
