import { Component } from '@angular/core';
import {User} from "../Models/User";
import Swal from "sweetalert2";
import {HttpResponse} from "@angular/common/http";
import {UserService} from "../Services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {
user=new User();
constructor(private userService:UserService,private route:Router) {
}
sendPasswordToken(){
  if (!this.user.email) {

    Swal.fire('Fail', 'Please fill in all required fields !', 'warning');


    return;
  }
  if (!this.user.email.includes('@') || !this.user.email.includes('.')) {
    Swal.fire('Fail', 'Invalid Email !', 'warning');



    return;
  }
  this
  this.userService.forgetPassword( this.user).subscribe((response: HttpResponse<any>) => {
    if(response.status==200){
      Swal.fire('Email sent', 'Check your Email !', 'success');
      this.route.navigate(["/VerifiedTokenPassword/" ]);


    }
    else if(response.status==400){

      Swal.fire('Fail', 'You have no Account !', 'warning');

    }
    else       Swal.fire('Error', 'try again !', 'error');

  },
    (error: any) => {
      if(error.status==200){
        Swal.fire('Email sent', 'Check your Email !', 'success');
        this.route.navigate(["/VerifiedTokenPassword/" ]);


      }
      else if(error.status==400){

        Swal.fire('Fail', 'You have no Account !', 'warning');

      }
      else       Swal.fire('Error', 'try again !', 'error');

    }
    );
}
}
