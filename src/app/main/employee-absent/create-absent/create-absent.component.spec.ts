import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAbsentComponent } from './create-absent.component';

describe('CreateAbsentComponent', () => {
  let component: CreateAbsentComponent;
  let fixture: ComponentFixture<CreateAbsentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAbsentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAbsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
