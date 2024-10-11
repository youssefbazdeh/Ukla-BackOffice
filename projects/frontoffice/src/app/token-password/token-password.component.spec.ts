import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenPasswordComponent } from './token-password.component';

describe('TokenPasswordComponent', () => {
  let component: TokenPasswordComponent;
  let fixture: ComponentFixture<TokenPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TokenPasswordComponent]
    });
    fixture = TestBed.createComponent(TokenPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
