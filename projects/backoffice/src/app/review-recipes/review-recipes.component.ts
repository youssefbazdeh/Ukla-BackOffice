import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RecipeService } from '../Services/recipe.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { GlobalService } from '../Services/global.service';
import { LoaderService } from '../Services/loader.service';
import { AuthService } from '../Services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'back-review-recipes',
  templateUrl: './review-recipes.component.html',
  styleUrls: ['./review-recipes.component.css']
})
export class ReviewRecipesComponent implements OnInit{
  recipes!:any[];
  statusList = ['Accepted', 'Require_changes', 'In_review', 'Banned', 'Verified'];
  status="In_review";

  imageUrl !:string ;
  filteredReviews: any[] = []; // Array to store filtered recipes
  searchTerm: string = ''; // Search term entered by the user
  imagesToShow :SafeUrl[]=[];
  itemsPerPage: number = 6;
  currentPage: number = 1;
  reviewsCount!:number;
  ReviewRecipes: any[] = [];
  allReviews!: any[];
  recipesWithReviews : any[] = [this.filteredReviews,this.filteredReviews];
  constructor(
    private formBuilder: FormBuilder,
    private recipeService: RecipeService,
    private sanitizer: DomSanitizer,private globalService:GlobalService,public loaderService: LoaderService,private authServices:AuthService
  ) {}
  ngOnInit(): void {

    this.getReviews(1,this.itemsPerPage,this.status);
    
   }

   filterReviewsByStatus() {
    this.getReviews(1,this.itemsPerPage,this.status);
  }


   getReviewsCountByStatus(status:any){    
    this.recipeService.getReviewsCount(status).subscribe(
      (response: any) => {
        if (response) {
          this.reviewsCount=response;

        }

  }
    );}
    get displayedRecipes(): any[] {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredReviews.slice(startIndex, endIndex);
    }
    get totalPages(): number {
      return Math.ceil(this.reviewsCount / this.itemsPerPage);
    }
    get pages(): number[] {
      return Array.from({ length: this.totalPages }, (_, index) => index + 1);
    }
    changePage(page: number): void {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.getReviewsWithPagination( this.currentPage,this.itemsPerPage,this.status)
      }
    }
    
    getReviews(pageN:number,itemN:number,status:string){
      this.recipeService.getReviewsWithPagination(pageN,itemN,status).subscribe(
        (data) => {
          this.filteredReviews=data;
          this.getReviewsCountByStatus(this.status);
          
          
        },
        error => {
          this.filteredReviews=[];
          console.error('Error fetching review', error);
        }
      )
    }

    getReviewsWithPagination(pageN:number,itemN:number,status:string) {
      this.recipeService.getReviewsWithPagination(pageN,itemN,status).subscribe(
        (response) => {
          this.filteredReviews=response;
          }
      );
    }
    
    
  
  onLogoutClick(): void {
    this.globalService.logout().subscribe();
      }
}
