import {UserService} from './../Services/user.service';
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {AuthService} from '../Services/auth.service';
import {User} from "../Models/User";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
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
console.log(response)
        if (response.status == 200) {
          this.authService.login(this.username, this.password).subscribe((data) => {
              console.log(data)
            if (data) {
              window.sessionStorage.setItem("access-token", data.access_token);
              this.authService.decodeJWT(window.sessionStorage.getItem("access-token"));
              Swal.fire('Hi', 'Welcome Again !', 'success');
              if (this.authService.role == "ROLE_USER") {
                Swal.fire('No Access !', 'Contact Admin for more information', 'error');

                this.router.navigate(["/Waiting"])

              }
              else {
                Swal.fire('Hi', 'Welcome Again !', 'success');

                this.router.navigate(["/Recipes"])


              }
            }
          },
            (error: any) => {
              console.log(error)
              if (error) {

                window.sessionStorage.setItem("access-token", error.access_token);
                this.authService.decodeJWT(window.sessionStorage.getItem("access-token"));
                Swal.fire('Hi', 'Welcome Again !', 'success');
                if (this.authService.role == "ROLE_USER") {
                  Swal.fire('No Access !', 'Contact Admin for more information', 'error');

                  this.router.navigate(["/Waiting"])

                }
                else {
                  Swal.fire('Hi', 'Welcome Again !', 'success');

                  this.router.navigate(["/Recipes"])


                }
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
            Swal.fire('Hi', 'Welcome Again !', 'success');
            if (this.authService.role == "ROLE_USER") {
              Swal.fire('No Access !', 'Contact Admin for more information', 'error');

              this.router.navigate(["/Waiting"])

            }
            else if(this.authService.role == "ROLE_CREATOR"){
              Swal.fire('Hi', 'Welcome Again !', 'success');

              this.router.navigate(["/CreatorRecipes"])
            }
            else {
              Swal.fire('Hi', 'Welcome Again !', 'success');

              this.router.navigate(["/Recipes"])


            }
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
