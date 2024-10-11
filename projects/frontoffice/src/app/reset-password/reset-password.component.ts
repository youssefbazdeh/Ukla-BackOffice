import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { UserService } from '../Service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../Models/User';

@Component({
  selector: 'front-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  password!: string;
  passwordC!: string;
  token!: string;

  currentUser = new User();
  userData: any;

  message!: string;
  email!: any;

  constructor(private userService: UserService,
              private dialog: MatDialog, private route: ActivatedRoute, private routeB: Router
  ) {
  }

  ngOnInit(): void {


    this.route.params.subscribe(params => {

      this.token = params['token'];
    });
    this.getUserByToken();

  }
getUserByToken(){
  this.userService.getUserByToken(this.token).subscribe(
    (response:any) => {

      this.currentUser.email=response.email;
      console.log(this.currentUser)
    });
}
  newPassword() {


    if (!this.password || !this.passwordC) {
      Swal.fire('Fail', 'Please fill in all required fields !', 'warning');


      return;
    }
    if (this.password.length < 8) {
      Swal.fire('Fail', '8 characters required for password !', 'warning');

      return;
    }
    if (this.password !== this.passwordC) {
      Swal.fire('Email sent', 'Check your Email !', 'success');


      return;
    }

    this.currentUser.password=this.password;
    this.userService.updatePass(this.currentUser).subscribe(
      (response:HttpResponse<any>) => {
        if (response.status==200) {
          Swal.fire('Successfully updated', 'You can Login now !', 'success');
          this.routeB.navigate(["/deleteAccount"]);
        }
        else {
          Swal.fire('error', 'try again!', 'error');

        }
      },
      error => {
        if (error.status==200) {
          Swal.fire('Successfully updated', 'You can Login now !', 'success');
          this.routeB.navigate(["/deleteAccount"]);
        }
        else {
          Swal.fire('error', 'try again!', 'error');

        }
      }
    );
  }
}
