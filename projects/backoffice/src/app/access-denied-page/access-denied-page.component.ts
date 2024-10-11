import { Component } from '@angular/core';
import { UserService } from '../Services/user.service';
import { AuthService } from '../Services/auth.service';
import { GlobalService } from '../Services/global.service';

@Component({
  selector: 'back-access-denied-page',
  templateUrl: './access-denied-page.component.html',
  styleUrls: ['./access-denied-page.component.css']
})
export class AccessDeniedPageComponent {
  constructor(private userService: UserService,private authService: AuthService,private globalService:GlobalService
  ) {
  }

onLogoutClick(): void {
  this.globalService.logout().subscribe();
}
}
