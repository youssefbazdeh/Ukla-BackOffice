import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../Services/auth.service';
import { LoaderService } from '../Services/loader.service';
import { Router } from '@angular/router';
import { User } from '../Models/User';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'back-creator-registration',
  templateUrl: './creator-registration.component.html',
  styleUrls: ['./creator-registration.component.css']
})
export class CreatorRegistrationComponent implements OnInit {
  email!: string;
  users!: User[];
  newUser = new User();
  RegForm!: FormGroup;
  currentDate!: Date;
  showPassword: boolean = false;
  selectedImage: string | ArrayBuffer | null = null;
  newImage!: File;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  constructor(private router: Router,private authService: AuthService ,
    private formBuilder: FormBuilder,public loaderService: LoaderService,private sanitizer: DomSanitizer) {    this.currentDate = new Date();

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
    description: new FormControl(''),





  });



}
successNotification() {
  Swal.fire('Hi', 'Mail verification Sent !', 'success');
}


fileChangeEvent(event: any): void {
  this.imageChangedEvent = event;
}
imageCropped(event: ImageCroppedEvent) {
  // Fetch the blob from the URL
  fetch(event.objectUrl as string)
  .then(response => response.blob())
  .then(blob => {
      // Create a File object from the Blob
      this.newImage = new File([blob], "croppedImage.png", { type: "image/png" });

      // Optionally, update the croppedImage property for preview
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
  })
  .catch(error => {
      console.error('Error fetching blob from URL:', error);
      // Handle the error appropriately
  });
 }

 
 
imageLoaded(image: LoadedImage) {
  // show cropper
}
cropperReady() {
  // cropper ready
}
loadImageFailed() {
  // show message
}
 

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  userCreate() {

   if (!this.RegForm.value.description || !this.RegForm.value.firstName || !this.RegForm.value.lastName || !this.RegForm.value.password ||
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
    const formData = new FormData();
    const json = JSON.stringify(this.RegForm.value);
    const blob = new Blob([json], {
      type: 'application/json'
    });

    
    formData.append('creator', blob);
    formData.append('image', this.newImage);

    this.authService.ajouterCreator(formData).subscribe((response: HttpResponse<any>) => {
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
