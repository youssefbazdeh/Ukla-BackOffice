import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';
import { UserService } from '../Services/user.service';
import { AuthService } from '../Services/auth.service';
import Swal from 'sweetalert2';
import { User } from '../Models/User';
import { HttpResponse } from '@angular/common/http';
import {LoaderService} from "../Services/loader.service";

@Component({
  selector: 'app-mail-verification',
  templateUrl: './mail-verification.component.html',
  styleUrls: ['./mail-verification.component.css']
})
export class MailVerificationComponent implements OnInit{
  code!:string;
  email!:string;
  user!: any;
  context!: string;
  constructor(private router: Router,private userService: UserService,private authService: AuthService,private route: ActivatedRoute
              ,public loaderService: LoaderService
    ) {
    }
    ngOnInit() {
     this.email= this.route.snapshot.params['email'];
     this.user=this.userService.rechercherParEmail(this.email);
     this.route.queryParams.subscribe(params => {
      this.context = params['context'];
    });
 
    }

  alertConfirmation() {
    Swal.fire({
      title: 'Email confirmed',
      text: 'Your Email is verified you can login',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, not now ',
    }).then((result) => {
      if (result.value && this.context=="edit") {
        this.router.navigate(['Login']);
      } else if (result.value) {
        this.router.navigate(['Login']);
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'You need to login !', 'error');
      }
    });
  }
        submitCode(){

    if(!this.code){

      Swal.fire('Fail', 'Please fill the required code field !', 'warning');
    }

    else{          this.userService.confirmCode(this.code).subscribe((response: HttpResponse<any>) => {

        if (response.status==200) {
          this.alertConfirmation()
        }

        else if (response.status==400 ) {
          Swal.fire('Warning', 'Code not found check your email', 'warning');
        }
        else if (response.status==302  ){
          Swal.fire('Warning', 'Email already confirmed ', 'warning');

        }
        else if (response.status==500  ){
          Swal.fire('Warning', 'Token expired try to send it again ', 'warning');

        }
      },
      (error: any) => {
      console.log(error.status)
        if (error.status==200) {
          this.alertConfirmation()
        }

        else if (error.status==404 ) {
          Swal.fire('Warning', 'Code does not exist check your email', 'warning');
        }
        else if (error.status==302  ){
          Swal.fire('Warning', 'Email already confirmed ', 'warning');

        }
        else if (error.status==500  ){
          Swal.fire('Warning', 'Token expired try to send it again ', 'warning');

        }


      }





    );}


        }

    resendCode(){
      this.loaderService.setLoading(true);      this.userService.resendCode(this.email).subscribe((response: HttpResponse<any>) => {
        console.log(response.status);
          if (response.status==200) {
            this.loaderService.setLoading(false);


            Swal.fire('Code sended', 'Check your email ', 'success');



          }
        },
        (error: any) => {
    console.log(error);
          this.loaderService.setLoading(false);

Swal.fire('Fail', 'Check your code ', 'error');

}


      );


    }


}
