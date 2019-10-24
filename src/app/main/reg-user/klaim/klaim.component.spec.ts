import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KlaimComponent } from './klaim.component';

describe('KlaimComponent', () => {
  let component: KlaimComponent;
  let fixture: ComponentFixture<KlaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KlaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KlaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
