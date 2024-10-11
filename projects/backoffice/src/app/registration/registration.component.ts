import { Component  , OnInit, TemplateRef, ViewChild} from '@angular/core';
import { User } from '../Models/User';
import {AuthService} from '../Services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LoaderService } from '../Services/loader.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  email!: string;
  users!: User[];
  newUser = new User();
  RegForm!: FormGroup;
  currentDate!: Date;
  showPassword: boolean = false;

  constructor(private router: Router,private authService: AuthService ,
    private formBuilder: FormBuilder,public loaderService: LoaderService) {    this.currentDate = new Date();

}
ngOnInit(): void {
  this.RegForm = this.formBuilder.group({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    password: new FormControl(''),
    username: new FormControl(''),
    email: new FormControl(''),
    birthdate: new FormControl(''),
    gender: new FormControl(''),





  });



}
successNotification() {
  Swal.fire('Hi', 'Mail verification Sent !', 'success');
}


  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  userCreate() {

   if (!this.RegForm.value.firstName || !this.RegForm.value.lastName || !this.RegForm.value.password ||
    !this.RegForm.value.username || !this.RegForm.value.email || !this.RegForm.value.gender|| !this.RegForm.value.birthdate) {

      Swal.fire('Fail', 'Please fill in all required fields !', 'warning');


      return;
    }


    if (!this.RegForm.value.email.includes('@') || !this.RegForm.value.email.includes('.')) {
      Swal.fire('Fail', 'Invalid Email !', 'warning');



      return;
    }
    if (this.RegForm.value.birthdate>=this.currentDate ) {
      Swal.fire('Fail', 'unvalid Date', 'warning');

      return;
    }

    if (this.RegForm.value.password.length < 8) {
      Swal.fire('Fail', '8 characters required for password !', 'warning');

      return;
    }

    this.loaderService.setLoading(true);

    this.authService.ajouterUser( this.RegForm.value).subscribe((response: HttpResponse<any>) => {

        if (response.status==201 ) {

          this.loaderService.setLoading(false);

          Swal.fire('Hi', 'Mail verification Sent !', 'success');

this.router.navigate(["Verification/"+this.email]);

        } else if (response.status==302  ) {
          this.loaderService.setLoading(false);

          Swal.fire('Fail', 'UserName already exists !', 'warning');

        }
        else if (response.status == 406) {
          this.loaderService.setLoading(false);

          Swal.fire('Fail', 'Email already exists !', 'warning');

        }
      },
      (error: any) => {

        if (error.status==201 ) {

          this.loaderService.setLoading(false);

          Swal.fire('Hi', 'Mail verification Sent !', 'success');

this.router.navigate(["Verification/"+this.RegForm.value.email]);

        } else if (error.status==302  ) {
          this.loaderService.setLoading(false);

          Swal.fire('Fail', 'UserName already exists !', 'warning');

        }
        else if (error.status == 406) {
          this.loaderService.setLoading(false);

          Swal.fire('Fail', 'Email already exists !', 'warning');

        }

        }


    );


  }
}
