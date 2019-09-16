import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainTplComponent } from './maintain-tpl.component';

describe('MaintainTplComponent', () => {
  let component: MaintainTplComponent;
  let fixture: ComponentFixture<MaintainTplComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainTplComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
