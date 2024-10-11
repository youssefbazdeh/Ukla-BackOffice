import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorMenuComponent } from './creator-menu.component';

describe('CreatorMenuComponent', () => {
  let component: CreatorMenuComponent;
  let fixture: ComponentFixture<CreatorMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatorMenuComponent]
    });
    fixture = TestBed.createComponent(CreatorMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
