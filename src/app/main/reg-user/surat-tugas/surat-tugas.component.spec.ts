import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuratTugasComponent } from './surat-tugas.component';

describe('SuratTugasComponent', () => {
  let component: SuratTugasComponent;
  let fixture: ComponentFixture<SuratTugasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuratTugasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuratTugasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
