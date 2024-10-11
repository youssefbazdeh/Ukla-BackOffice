import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {RecipeService} from "../Services/recipe.service";
import {LoaderService} from "../Services/loader.service";
import Swal from "sweetalert2";
import {GlobalService} from "../Services/global.service";
import {AuthService} from "../Services/auth.service";

@Component({
  selector: 'back-creator-recipes',
  templateUrl: './creator-recipes.component.html',
  styleUrls: ['./creator-recipes.component.css']
})
export class CreatorRecipesComponent implements OnInit{
  recipes!:any[];
  statusList = ['Accepted', 'Require_changes', 'In_review', 'Banned', 'Verified'];

  imageUrl !:string ;
  filteredRecipes: any[] = []; // Array to store filtered recipes
  searchTerm: string = ''; // Search term entered by the user
  imagesToShow :SafeUrl[]=[];
  itemsPerPage: number = 6;
  currentPage: number = 1;
  recipesCount!:number;
  recipeStatus = 'In_review';
  constructor(
    
    private formBuilder: FormBuilder,
    private recipeService: RecipeService,
    private sanitizer: DomSanitizer,private globalService:GlobalService,public loaderService: LoaderService,private authServices:AuthService
  ) {}
  ngOnInit(): void {

    this.getRecipes(1,this.itemsPerPage);
    this.getRecipesCount();
   }
   getRecipesCount(){
     this.recipeService.getCreatorRecipesCount().subscribe(
       (response: any) => {
         if (response) {
           this.recipesCount=response;
         }

   }
     );}
  get displayedRecipes(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredRecipes.slice(startIndex, endIndex);
  }
  get totalPages(): number {
    return Math.ceil(this.recipesCount / this.itemsPerPage);
  }
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getRecipes( this.currentPage,this.itemsPerPage)

    }
  }


  onLogoutClick(): void {
    this.globalService.logout().subscribe();
      }
  searchRecipes() {
    const searchTermLower = this.searchTerm.toLowerCase();

    this.filteredRecipes = this.recipes.filter(recipe => {
      const nameLower = recipe.name.toLowerCase();
      const descriptionLower = recipe.description.toLowerCase();

      return nameLower.includes(searchTermLower) || descriptionLower.includes(searchTermLower);
    });
  }
  deleteRecipe(id:number){
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
        this.recipeService.deleteRecipe(id).subscribe(
          (response: any) => {
            if (response.status == 200) {
              Swal.fire({
                title: 'Deleted!',
                text: 'Your Recipe has been deleted.',
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
                text: 'Your Recipe has been deleted.',
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
  displayImage(imageBlob: Blob): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imageUrl = e.target.result;
    };
    reader.readAsDataURL(imageBlob);
  }
  getRecipes(pageN:number,itemN:number) {
    this.recipeService.getCreatorRecipesByUsername(pageN,itemN).subscribe(
      (response) => {
        if (response) {


          this.recipes = response;
          this.filteredRecipes=response;
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