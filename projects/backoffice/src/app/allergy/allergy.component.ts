import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {AllergyService} from "../Services/allergie.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LoaderService} from "../Services/loader.service";
import {RecipeService} from "../Services/recipe.service";

import Swal from "sweetalert2";
import {HttpResponse} from "@angular/common/http";
import {Allergy} from "../Models/Allergy";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {GlobalService} from "../Services/global.service";

@Component({
  selector: 'app-allergy',
  templateUrl: './allergy.component.html',
  styleUrls: ['./allergy.component.css']
})
export class AllergyComponent implements OnInit {
  id!: number;
  imageId!: number;
  allergy= new Allergy();
  ingredientNames!: any;
  ingredientIds: any[] = [];
  AllergyForm!: FormGroup;
  selectedOptions: any[] = [];
  selectedOption!: any;
  imagesToShow :SafeUrl[]=[];

  constructor(private formBuilder: FormBuilder,
              private allergyService: AllergyService, private router: Router,
              private route: ActivatedRoute, public loaderService: LoaderService, private sanitizer: DomSanitizer,private globalService:GlobalService
  ) {
  }

  ngOnInit() {

    this.id = this.route.snapshot.params['id'];
    this.getAllergy()
  }
  onLogoutClick(): void {
    this.globalService.logout().subscribe();
  }
  getAllergy() {
    this.allergyService.getAllergyById(this.id
    ).subscribe(
      (response) => {
        if (response) {
          this.allergy.name = response.name;
          this.imageId = response.image.id;
          this.ingredientNames=response.ingredients;



            this.globalService.getImage(response.image.id).subscribe(
              (data: Blob) => {
                console.log(data)
                const objectURL = URL.createObjectURL(data);
                const safeURL = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                this.imagesToShow[response.image.id]=safeURL;
              },
              error => {
                console.error('Error fetching image', error);
              }
            );
          for(let i = 0; i < response.ingredients.length ; i++){
            console.log(response.ingredients[i].image.id)
            this.globalService.getImage(response.ingredients[i].image.id).subscribe(
              (data: Blob) => {
                console.log(data)
                const objectURL = URL.createObjectURL(data);
                const safeURL = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                this.imagesToShow[response.ingredients[i].image.id]=safeURL;
              },
              error => {
                console.error('Error fetching image', error);
              }
            );
          }

          }




      },

      (error: any) => {
        console.log(error);
      }
    );
  }
  delete(id:number){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.allergyService.deleteAllergy(id).subscribe(
          (response: any) => {
            console.log(response)
            if (response.status == 200) {
              Swal.fire({
                title: 'Deleted!',
                text: 'Your Allergy has been deleted.',
                icon: 'success',
                confirmButtonText: 'OK',
              }).then((result) => {
                if (result.value) {
this.router .navigate(["/Allergies"])               }
              });
            } else Swal.fire('Error', 'Try again', 'error');
          },
          (error: any) => {
            if (error.status == 200) {
              Swal.fire({
                title: 'Deleted!',
                text: 'Your Allergy has been deleted.',
                icon: 'success',
                confirmButtonText: 'OK',
              }).then((result) => {
                if (result.value) {
                  this.router .navigate(["/Allergies"])
                }
              });
            } else Swal.fire('Error', 'Try again', 'error');
          }
        );

      }
    })


  }





}
