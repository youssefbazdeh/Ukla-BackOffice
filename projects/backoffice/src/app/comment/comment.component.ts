import { Component, Input, OnInit } from '@angular/core';
import { RecipeService } from '../Services/recipe.service';
import { LoaderService } from '../Services/loader.service';
import { HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'back-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit{
  @Input() recipeName: any;
  @Input() recipeID: any;
  @Input() currentUserRole: any;
  commentText!: string;
  status!: string;
  InitialStatus!: string;
  reviewId!:number;
  statusList = ['Accepted', 'Require_changes', 'In_review', 'Banned', 'Verified'];
  CreatorstatusList = ['Require_changes', 'In_review'];
  constructor(
    private recipeService: RecipeService,public loaderService: LoaderService,private router: Router,private authService: AuthService,
  ) {}
  
  ngOnInit(): void {
    this.authService.decodeJWT(window.sessionStorage.getItem("access-token"));
    this.currentUserRole=this.authService.role[0];
    this.getRecipe()
  }
  getRecipe() {
    this.recipeService.getReviewByRecipeID(this.recipeID).subscribe(
      (response: any) => {
        this.commentText=response.comment;
        this.status=response.recipe.status;
        this.reviewId=response.id;
        this.InitialStatus=response.recipe.status;
        }
        );
      }
  isSubmitEnabled() {
    if(this.status!== 'Require_changes'){
      return true;
    } else return false;
  }
  
  onSubmit(formData: any): void {

    let comment = formData.comment;
    let status = formData.status; 
    
    Swal.fire({
      title: 'Are you sure?',
      text: "You are changing this status from "+this.InitialStatus+" to "+status+"!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loaderService.setLoading(true);
  const formdata = new FormData();
  formdata.append('recipeID',this.recipeID)
  formdata.append('comment', comment);
  formdata.append('status', status);
    if(this.currentUserRole== "ROLE_CREATOR"){
      this.recipeService.setReviewInreviewStatus(this.reviewId,formdata)
      .subscribe((response: HttpResponse<any>) => {
        if (response.status == 201) {
          this.loaderService.setLoading(false);
          
          if(this.currentUserRole== "ROLE_CREATOR"){
            Swal.fire('Nice', 'Recipe updated !', 'success');
            this.router.navigate(['/CreatorRecipes']);
          }else{
            Swal.fire('Nice', 'Recipe reviewed !', 'success');
            this.router.navigate(['/ReviewRecipes']);
          }
          
        } else {
          this.loaderService.setLoading(false);
          Swal.fire('Fail', 'error try again!', 'error');

        }
      },
      (error: any) => {
        if (error.status == 201) {
          this.loaderService.setLoading(false);

          if(this.currentUserRole== "ROLE_CREATOR"){
            Swal.fire('Nice', 'Recipe updated !', 'success');
            this.router.navigate(['/CreatorRecipes']);
          }else{
            Swal.fire('Nice', 'Recipe reviewed !', 'success');
            this.router.navigate(['/ReviewRecipes']);
          }
        } else {
          this.loaderService.setLoading(false);
          Swal.fire('Fail', 'error!', 'error');

        }
      });
    }else{
      this.recipeService.updateReview(this.reviewId,formdata)
      .subscribe((response: HttpResponse<any>) => {
        if (response.status == 201) {
          this.loaderService.setLoading(false);
          
          if(this.currentUserRole== "ROLE_CREATOR"){
            Swal.fire('Nice', 'Recipe updated !', 'success');
            this.router.navigate(['/CreatorRecipes']);
          }else{
            Swal.fire('Nice', 'Recipe reviewed !', 'success');
            this.router.navigate(['/ReviewRecipes']);
          }
          
        } else {
          this.loaderService.setLoading(false);
          Swal.fire('Fail', 'error try again!', 'error');

        }
      },
      (error: any) => {
        if (error.status == 201) {
          this.loaderService.setLoading(false);

          if(this.currentUserRole== "ROLE_CREATOR"){
            Swal.fire('Nice', 'Recipe updated !', 'success');
            this.router.navigate(['/CreatorRecipes']);
          }else{
            Swal.fire('Nice', 'Recipe reviewed !', 'success');
            this.router.navigate(['/ReviewRecipes']);
          }
        } else {
          this.loaderService.setLoading(false);
          Swal.fire('Fail', 'error!', 'error');

        }
      });
    }

      }
    })
    
    }
      

     
}
