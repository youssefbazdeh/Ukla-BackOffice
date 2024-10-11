import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCreatorProfileComponent } from './edit-creator-profile.component';

describe('EditCreatorProfileComponent', () => {
  let component: EditCreatorProfileComponent;
  let fixture: ComponentFixture<EditCreatorProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditCreatorProfileComponent]
    });
    fixture = TestBed.createComponent(EditCreatorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
