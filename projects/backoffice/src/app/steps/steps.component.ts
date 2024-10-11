import {Component, OnInit} from '@angular/core';
import {RecipeService} from "../Services/recipe.service";
import {ActivatedRoute, Route, Router} from "@angular/router";
import Swal from "sweetalert2";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {GlobalService} from "../Services/global.service";
import {AuthService} from '../Services/auth.service';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.css']
})
export class StepsComponent implements OnInit {
  steps: any;
  recipe: any;
  name!: string;
  imagesToShow :SafeUrl[]=[];
  currentUserRole!:string;
  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private router: Router ,private authService: AuthService,
              private sanitizer: DomSanitizer,private globalService:GlobalService) {
  }

  ngOnInit(): void {
    this.authService.decodeJWT(window.sessionStorage.getItem("access-token"));
    this.currentUserRole=this.authService.role[0];
    
    this.name = this.route.snapshot.params['recipeN'];

    this.getRecipeSteps();

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
                  if(this.currentUserRole== "ROLE_CREATOR"){
                    Swal.fire('Nice', 'Recipe up to date !', 'success');
                    this.router.navigate(['/CreatorRecipes']);
                  }else{
                    Swal.fire('Nice', 'Recipe up to date !', 'success');
                    this.router.navigate(['/Recipes']);
                  }
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
                  if(this.currentUserRole== "ROLE_CREATOR"){
                    Swal.fire('Nice', 'Recipe up to date !', 'success');
                    this.router.navigate(['/CreatorRecipes']);
                  }else{
                    Swal.fire('Nice', 'Recipe up to date !', 'success');
                    this.router.navigate(['/Recipes']);
                  }
                }
              });
            } else Swal.fire('Error', 'Try again', 'error');
          }
        );

      }
    })


  }
  deleteStep(idRecipe:number,idStep:number){
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
        this.recipeService.deleteStep(idRecipe,idStep).subscribe(
          (response: any) => {
            if (response.status == 200) {
              Swal.fire({
                title: 'Deleted!',
                text: 'Your Step has been deleted.',
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
                text: 'Your Step has been deleted.',
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
  onLogoutClick(): void {
    this.globalService.logout().subscribe();
  }
  getRecipeSteps() {

    this.recipeService.getRecipeByName(this.name).subscribe(
      (response:any) => {
        if (response) {
          this.recipe = response;
          this.steps = this.recipe.steps;
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

        }
      },

      (error: any) => {
        console.log(error);
      }
    );

  }

}
