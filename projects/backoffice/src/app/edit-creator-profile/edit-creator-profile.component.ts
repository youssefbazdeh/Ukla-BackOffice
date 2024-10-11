import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../Services/user.service';
import { User } from '../Models/User';
import { Creator } from '../Models/Creator';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { LoaderService } from '../Services/loader.service';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { GlobalService } from '../Services/global.service';
import { Image } from '../Models/Image';
import { HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'back-edit-creator-profile',
  templateUrl: './edit-creator-profile.component.html',
  styleUrls: ['./edit-creator-profile.component.css']
})
export class EditCreatorProfileComponent implements OnInit{
  id:any;
  imageId:any;
  fieldChanges: boolean = false;
  newImage!: File;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  imagesToShow :SafeUrl[]=[];
  currentDate!: Date;
  isEditable: { [key: string]: boolean } = {
    firstName: false,
    lastName: false,
    username: false,
    description: false,
    birthdate: false,
    gender: false,
    email: false
   };

  creator:Creator={
    email: "",
    gender: "",
    firstName:"",
    lastName:"",
    username:"",
    description:"",
    birthdate:"",
    image:new Image,
    
  }
  constructor(
    private route:ActivatedRoute, private globalService:GlobalService,
    private router:Router,private http: UserService,public loaderService: LoaderService,private sanitizer: DomSanitizer){this.currentDate = new Date();}

  ngOnInit(): void {
    
    this.http.getCreatorByUsername()
   .subscribe(data =>{
   
    this.imageId= data.image.id;
    

    this.creator=data;
    if(data.image!=null){

      this.globalService.getImage(data.image.id).subscribe(
        (data: Blob) => {
          const objectURL = URL.createObjectURL(data);
          const safeURL = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          this.imagesToShow[this.imageId] = safeURL;
        },
        error => {
          console.error('Error fetching image', error);
        }
      );
    }
    
  }, error => console.log(error));

  }

  update(){
 const { username, firstName, lastName, birthdate, gender, email, description } = this.creator;

 const userDetails = {
   username,
   firstName,
   lastName,
   birthdate,
   gender,
   email,
   description
 };

    if (!this.creator.email.includes('@') || !this.creator.email.includes('.')) {
      Swal.fire('Fail', 'Invalid Email !', 'warning');



      return;
    }
    if (this.creator.birthdate>=this.currentDate.toISOString().slice(0, 10) ) {
      Swal.fire('Fail', 'unvalid Date', 'warning');

      return;
    }
    const formData = new FormData();
    const json = JSON.stringify(userDetails);
    const blob = new Blob([json], {
      type: 'application/json'
    });
    formData.append('creator', blob);
this.loaderService.setLoading(true);

      this.http.updateCreatorProfile(formData)
        .subscribe((response: HttpResponse<any>) => {
          if (response.status==201 ) {
  
            this.loaderService.setLoading(false);
  
            Swal.fire('Hi', 'Mail verification Sent !', 'success');
  
  this.router.navigate(["Verification/"+this.creator.email]);
  
          }
          else if (response.status==200  ) {
            this.loaderService.setLoading(false);
  
            Swal.fire('Hi', 'Profile up to date !', 'success');
  
  this.router.navigate(["CreatorRecipes"]);
  
          }
          else if (response.status==202  ) {
            this.loaderService.setLoading(false);
  
            Swal.fire('Hi', 'Username updated !', 'success');
            this.router.navigate(["Login"]);

          } else if (response.status==302  ) {
            this.loaderService.setLoading(false);
  
            Swal.fire('Fail', 'UserName already exists !', 'warning');
  
          }
          else if (response.status == 406) {
            this.loaderService.setLoading(false);
  
            Swal.fire('Fail', 'Email already exists !', 'warning');
  
          }else if (response.status == 207) {
            this.loaderService.setLoading(false);
  
            Swal.fire('Hi', 'Mail verification Sent !', 'success');
            this.router.navigate(["Verification/"+this.creator.email], { queryParams: { context: 'edit' } });
  
          }
        },
        (error: any) => {
          if (error.status==200 ) {
  
            this.loaderService.setLoading(false);
  
            Swal.fire('Hi', 'Profile up to date !', 'success');
  
  this.router.navigate(["CreatorRecipes"]);
  
          } else if (error.status==201  ) {
            this.loaderService.setLoading(false);
  
            Swal.fire('Hi', 'Mail verification Sent !', 'success');
            this.router.navigate(["Verification/"+this.creator.email], { queryParams: { context: 'edit' } });

          } else if (error.status==207  ) {
            this.loaderService.setLoading(false);
  
            Swal.fire('Hi', 'Mail verification Sent !', 'success');
            this.router.navigate(["Verification/"+this.creator.email], { queryParams: { context: 'edit' } });

          }
          else if (error.status==202  ) {
            this.loaderService.setLoading(false);
  
            Swal.fire('Hi', 'Username updated !', 'success');
            this.router.navigate(["Login"]);

          }
          else if (error.status==302  ) {
            this.loaderService.setLoading(false);
  
            Swal.fire('Fail', 'UserName already exists !', 'warning');
  
          }
          else if (error.status == 406) {
            this.loaderService.setLoading(false);
  
            Swal.fire('Fail', 'Email already exists !', 'warning');
  
          }
  
          }
  
  
      );
    if(this.newImage){


      const formData = new FormData();
      formData.append('image', this.newImage);
      this.http.updateImage(formData) .subscribe(
        (response: HttpResponse<any>) => {
  
          if(response.status==200){
  
            Swal.fire('Nice', 'Image up to date !', 'success');
  
          }
  
        }
        ,
        error => {
          if(error.status==200){
  
            Swal.fire('Nice', 'Image up to date !', 'success');
  
          }
        });
      }
  }

  enableEdit(fieldName: string) {
    this.fieldChanges=true;
    this.isEditable[fieldName] = !this.isEditable[fieldName];
    if (this.fieldChanges) {
      window.onbeforeunload = (event) => {
          event.returnValue = 'The updated field will be lost !';
      };
      }
  }

  fileChangeEvent(event: any): void {
    this.fieldChanges=true;
    this.imageChangedEvent = event;
    if (this.fieldChanges) {
      window.onbeforeunload = (event) => {
          event.returnValue = 'The updated field will be lost !';
      };
      }
  }
  imageCropped(event: ImageCroppedEvent) {
    // Fetch the blob from the URL
    fetch(event.objectUrl as string)
    .then(response => response.blob())
    .then(blob => {
        // Create a File object from the Blob
        this.newImage = new File([blob], "croppedImage1.png", { type: "image/png" });
  
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
}
