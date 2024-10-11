import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneCarouselComponent } from './phone-carousel.component';

describe('PhoneCarouselComponent', () => {
  let component: PhoneCarouselComponent;
  let fixture: ComponentFixture<PhoneCarouselComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhoneCarouselComponent]
    });
    fixture = TestBed.createComponent(PhoneCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
