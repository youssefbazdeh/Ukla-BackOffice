import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessDeniedPageComponent } from './access-denied-page.component';

describe('AccessDeniedPageComponent', () => {
  let component: AccessDeniedPageComponent;
  let fixture: ComponentFixture<AccessDeniedPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccessDeniedPageComponent]
    });
    fixture = TestBed.createComponent(AccessDeniedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
