import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../Service/user.service';
import { AuthService } from '../Service/auth.service';
import { User } from '../Models/User';

@Component({
  selector: 'front-login-to-delete-account',
  templateUrl: './login-to-delete-account.component.html',
  styleUrls: ['./login-to-delete-account.component.css']
})
export class LoginToDeleteAccountComponent {
  username!: string;
  password!: string;
  userData: any;
  role = "USER";
  enabled = true;
  showPassword: boolean = false;
  user=new User();

  constructor(private router: Router, private userService: UserService, private authService: AuthService
  ) {
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (!this.username || !this.password) {
      Swal.fire('Fail', 'Please fill in all required fields !', 'warning');

    } else {
      this.user.username=this.username;
      this.user.password=this.password;

      this.authService.LoginTests( this.user).subscribe((response) => {
        if (response.status == 200) {
          this.authService.login(this.username, this.password).subscribe((data) => {
            if (data) {
              window.sessionStorage.setItem("access-token", data.access_token);
              this.authService.decodeJWT(window.sessionStorage.getItem("access-token"));
              Swal.fire('Hi', 'Welcome Again !', 'success');
              this.router.navigate(["/deleteAccountConfirmation"])


              
            }
          },
            (error: any) => {
              if (error) {

                window.sessionStorage.setItem("access-token", error.access_token);
                this.authService.decodeJWT(window.sessionStorage.getItem("access-token"));
                
                  this.router.navigate(["/deleteAccountConfirmation"])

                
              }


            });
        }
        else
        {
          if (response.status == 404) {
            Swal.fire('Fail', 'Username does not exist ', 'error');
          }
          if (response.status == 406) {
            Swal.fire('Fail', 'wrong password ', 'error');
          }
          if (response.status == 500) {
            Swal.fire('Fail', 'Server Error ', 'error');
          }
          else {
            Swal.fire('Error', 'Error try again later ', 'error');
          }
        }
      },
    (error: any) => {
      console.log(error)
      if (error.status == 200) {
        this.authService.login(this.username, this.password).subscribe((data) => {
          if (data) {
            window.sessionStorage.setItem("access-token", data.access_token);
            this.authService.decodeJWT(window.sessionStorage.getItem("access-token"));
            
              this.router.navigate(["/deleteAccountConfirmation"])


            
          }
        },
          );
      }
      else
      {
        if (error.status == 404) {
          Swal.fire('Fail', 'Username does not exist ', 'error');
        }
        if (error.status == 406) {
          Swal.fire('Fail', 'wrong password ', 'error');
        }
        if (error.status == 500) {
          Swal.fire('Fail', 'Server Error ', 'error');
        }
        else {
          Swal.fire('Error', 'Error try again later ', 'error');
        }
      }
    },
  
  )
    ;
  }


}


}
