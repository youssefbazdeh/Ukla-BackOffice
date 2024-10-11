import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStepComponent } from './edit-step.component';

describe('EditStepComponent', () => {
  let component: EditStepComponent;
  let fixture: ComponentFixture<EditStepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditStepComponent]
    });
    fixture = TestBed.createComponent(EditStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
