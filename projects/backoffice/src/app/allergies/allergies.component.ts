import {Component, OnInit} from '@angular/core';
import {AllergyService} from "../Services/allergie.service";
import Swal from "sweetalert2";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {GlobalService} from "../Services/global.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-allergies',
  templateUrl: './allergies.component.html',
  styleUrls: ['./allergies.component.css']
})
export class AllergiesComponent implements OnInit{
  maxDisplayedIngredients = 1;
  showMore = false;
  cardHeight = 200;
  searchTerm: string = '';
  filteredAllergies: any[] = [];
  allergies!:any[];
  imagesToShow :SafeUrl[]=[];


  constructor(private allergiesService:AllergyService, private sanitizer: DomSanitizer,private globalService:GlobalService,private router: Router) {
  }
  ngOnInit() {
    this.getAllAllergies();
  }
  onLogoutClick(): void {
    this.globalService.logout().subscribe();
  }
  search() {
    const searchTermLower = this.searchTerm.toLowerCase();

    this.filteredAllergies = this.allergies.filter(allergy => {
      const nameLower = allergy.name.toLowerCase();

      return nameLower.includes(searchTermLower) ;
    });
  }

  getAllAllergies(){

    this.allergiesService.getAllergies().subscribe(
      (response:any)=>{
        console.log(response)
        this.filteredAllergies=response;
        this.allergies=response;
        for (let k = 0; k < response.length; k++) {
          this.globalService.getImage(response[k].image.id).subscribe(
            (data: Blob) => {
              console.log(data)
              const objectURL = URL.createObjectURL(data);
              const safeURL = this.sanitizer.bypassSecurityTrustUrl(objectURL);
              this.imagesToShow[response[k].image.id]=safeURL;
            },
            error => {
              console.error('Error fetching image', error);
            }
          );
          const lengthIn=response[k].ingredients.length;
          const Allergy=response[k];
for(let i = 0; i < lengthIn ; i++){
console.log(Allergy.ingredients[i].image.id)
  this.globalService.getImage(Allergy.ingredients[i].image.id).subscribe(
    (data: Blob) => {
      console.log(data)
      const objectURL = URL.createObjectURL(data);
      const safeURL = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      this.imagesToShow[Allergy.ingredients[i].image.id]=safeURL;
    },
    error => {
      console.error('Error fetching image', error);
    }
  );
}


        }


      },
      (error => {
        console.log(error);

      })


    );
  }
  increaseCardHeight() {
    this.cardHeight += 21;
    this.showMore = true

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
        this.allergiesService.deleteAllergy(id).subscribe(
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
                  window.location.reload();
                }
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
                  window.location.reload();
                }
              });
            } else Swal.fire('Error', 'Try again', 'error');
          }
        );

      }
    })


  }
}
