import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorRecipesComponent } from './creator-recipes.component';

describe('CreatorRecipesComponent', () => {
  let component: CreatorRecipesComponent;
  let fixture: ComponentFixture<CreatorRecipesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatorRecipesComponent]
    });
    fixture = TestBed.createComponent(CreatorRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
