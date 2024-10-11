import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewRecipesComponent } from './review-recipes.component';

describe('ReviewRecipesComponent', () => {
  let component: ReviewRecipesComponent;
  let fixture: ComponentFixture<ReviewRecipesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewRecipesComponent]
    });
    fixture = TestBed.createComponent(ReviewRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
