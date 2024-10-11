import { Component, OnInit } from '@angular/core';
import {UserService} from '../Services/user.service';
import {AuthService} from '../Services/auth.service';
import {GlobalService} from "../Services/global.service";

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.css']
})
export class WaitingComponent  {

  constructor(private userService: UserService,private authService: AuthService,private globalService:GlobalService
    ) {
    }

  onLogoutClick(): void {
    this.globalService.logout().subscribe();
  }
    /*
  ngOnInit(): void {
if (!this.authService.isAuthenticated()){
  setInterval(() => {
    this.userService.alertConfirmation();
  },   3*60*1000);
}
}*/




}
