import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginToDeleteAccountComponent } from './login-to-delete-account.component';

describe('LoginToDeleteAccountComponent', () => {
  let component: LoginToDeleteAccountComponent;
  let fixture: ComponentFixture<LoginToDeleteAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginToDeleteAccountComponent]
    });
    fixture = TestBed.createComponent(LoginToDeleteAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
