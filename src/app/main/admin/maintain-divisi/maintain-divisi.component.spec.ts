import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainDivisiComponent } from './maintain-divisi.component';

describe('MaintainDivisiComponent', () => {
  let component: MaintainDivisiComponent;
  let fixture: ComponentFixture<MaintainDivisiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainDivisiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainDivisiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
