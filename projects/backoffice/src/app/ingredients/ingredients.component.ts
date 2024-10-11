import { Component } from '@angular/core';
import {RecipeService} from "../Services/recipe.service";
import Swal from "sweetalert2";
import {IngredientService} from "../Services/ingredient.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {GlobalService} from "../Services/global.service";
import { Subject, debounceTime } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css']
})
export class IngredientsComponent {
  ingredientNames: any[] = [];
  itemsPerPage: number = 14;
  currentPage: number = 1;
  searchTerm: string = '';
  filteredIngredients: any[] = [];
  imagesToShow :SafeUrl[]=[];
  ingredientCount!:number;
  filteredIng: any[] = [];
  isEmpty:boolean=false;
  searchTerm$ = new Subject<string>();
  searchSubscription: any;
  
  constructor( private recipeService: RecipeService,private ingredientService:IngredientService,private sanitizer: DomSanitizer,private globalService:GlobalService
  ) {
  }

  ngOnInit() {
    this.getIngridientsNames(this.currentPage,this.itemsPerPage);
    this.getIngCount();
    this.searchSubscription = this.searchTerm$
      .pipe(debounceTime(500)) 
      .subscribe(searchTerm => this.search(searchTerm));
  }
  getIngCount(){
    this.ingredientService.getIngredientsCount().subscribe(
      (response: any) => {
        if (response) {
          this.ingredientCount=response;
        }
      }
    );}

  
  search(searchTerm: string) {
    const searchTermLower = searchTerm.toLowerCase();

    this.ingredientService.searchIngredient(searchTermLower).subscribe(
      (response) => {
        if (searchTermLower && response.length==0){
          this.isEmpty=true
        }
        else{
          this.isEmpty=false
        }
        if (response) {
          //this.filteredIngredients=response;
          this.filteredIng = response;
          for (let index = 0; index < response.length; index++) {

          
            if(response[index].image!=null){

              this.globalService.getImage(response[index].image.id).subscribe(
                (data: Blob) => {
                  const objectURL = URL.createObjectURL(data);
                  const safeURL = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                  this.imagesToShow[response[index].image.id] = safeURL;
                },
                error => {
                   console.error('Error fetching image', error);
                }
              );
            }

            this.filteredIng[index] = {
              id:response[index].id,
              name: response[index].name,
              image: response[index].image,
              unitAlternatives:response[index].unitAlternatives,
              checked: false,
            };
            


          }

        }
      },
      (error: any) => {
        console.log(error);
      }
    );
 }

  get totalPages(): number {
    return Math.ceil(this.ingredientCount/ this.itemsPerPage);
  }
  onLogoutClick(): void {
    this.globalService.logout().subscribe();
  }
  get displayedIngredients(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredIngredients.slice(startIndex, endIndex);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getIngridientsNames(this.currentPage,this.itemsPerPage)
    }
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
        this.ingredientService.deleteIngredient(id).subscribe(
          (response: any) => {
            if (response.status == 200) {
              Swal.fire({
                title: 'Deleted!',
                text: 'Your Ingredient has been deleted.',
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
                text: 'Your Ingredient has been deleted.',
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
  getIngridientsNames(pageN:number,itemN:number) {
    this.ingredientService.getAllIngredients(pageN,itemN).subscribe(
      (response) => {
        if (response) {

            this.ingredientNames = response;
          this.filteredIngredients = response;
          for (let k = 0; k < response.length; k++) {

            this.globalService.getImage(response[k].image.id).subscribe(
              (data: Blob) => {
                const objectURL = URL.createObjectURL(data);
                const safeURL = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                this.imagesToShow[response[k].image.id]=safeURL;
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

}
