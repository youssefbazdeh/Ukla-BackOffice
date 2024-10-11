import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorRegistrationComponent } from './creator-registration.component';

describe('CreatorRegistrationComponent', () => {
  let component: CreatorRegistrationComponent;
  let fixture: ComponentFixture<CreatorRegistrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatorRegistrationComponent]
    });
    fixture = TestBed.createComponent(CreatorRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
