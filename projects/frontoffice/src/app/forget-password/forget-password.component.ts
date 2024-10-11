import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { UserService } from '../Service/user.service';
import { Router } from '@angular/router';
import { User } from '../Models/User';
import { LoaderService } from '../Service/loader.service';

@Component({
  selector: 'front-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {
  user=new User();
  constructor(private userService:UserService,private route:Router,public loaderService:LoaderService) {
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
    this.loaderService.setLoading(true);
    this.userService.forgetPassword( this.user).subscribe((response: HttpResponse<any>) => {
      if(response.status==200){
        this.loaderService.setLoading(false);

        Swal.fire('Email sent', 'Check your Email !', 'success');
        this.route.navigate(["/verifiedTokenPassword/" ]);
  
  
      }
      else if(response.status==400){
        this.loaderService.setLoading(false);

        Swal.fire('Fail', 'You have no Account !', 'warning');
  
      }
      else{
        this.loaderService.setLoading(false);

        Swal.fire('Error', 'try again !', 'error');
      } 
  
    },
      (error: any) => {
        if(error.status==200){
          this.loaderService.setLoading(false);

          Swal.fire('Email sent', 'Check your Email !', 'success');
          this.route.navigate(["/verifiedTokenPassword/" ]);
  
  
        }
        else if(error.status==400){
          this.loaderService.setLoading(false);

          Swal.fire('Fail', 'You have no Account !', 'warning');
  
        }
        else{
          this.loaderService.setLoading(false);

          Swal.fire('Error', 'try again !', 'error');
        }       
  
      }
      );
  }
  }
  