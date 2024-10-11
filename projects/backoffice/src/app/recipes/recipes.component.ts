import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {RecipeService} from "../Services/recipe.service";
import {LoaderService} from "../Services/loader.service";
import Swal from "sweetalert2";
import {GlobalService} from "../Services/global.service";
import {AuthService} from "../Services/auth.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit{
  recipes!:any[];
  currentUserRole!:string;

  imageUrl !:string ;
 

  filteredRecipes: any[] = []; // Array to store filtered recipes
  searchTerm: string = ''; // Search term entered by the user
  imagesToShow :SafeUrl[]=[];
  itemsPerPage: number = 6;
  currentPage: number = 1;
  recipesCount!:number;
  constructor(
    private formBuilder: FormBuilder,
    private recipeService: RecipeService,private authService: AuthService,
    private sanitizer: DomSanitizer,private globalService:GlobalService,public loaderService: LoaderService,private authServices:AuthService
  ) {}
  ngOnInit(): void {
    this.authService.decodeJWT(window.sessionStorage.getItem("access-token"));
    this.currentUserRole=this.authService.role[0];
    this.getRecipes(1,this.itemsPerPage);
    this.getRecipesCount();
   }
   getRecipesCount(){
     this.recipeService.getRecipesCount().subscribe(
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
console.log(this.totalPages)
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
  
  ForceDeleteRecipe(id:number){
    Swal.fire({
      title: 'Are you sure?',
      text: "This action will affect all the users who have added this recipe to their week plans and grocery list !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.recipeService.forceDeleteRecipe(id).subscribe(
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
    this.recipeService.getRecipes(pageN,itemN).subscribe(
      (response) => {
        if (response) {

          console.log(response);

          this.recipes = response;
          this.filteredRecipes=response;
          console.log(this.filteredRecipes);
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

          }

        }
      },

      (error: any) => {
        console.log(error);
      }
    );
  }
}
