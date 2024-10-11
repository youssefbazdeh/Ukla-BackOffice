import { Component, OnInit } from '@angular/core';
import { TagService } from '../Services/tag.service';
import Swal from 'sweetalert2';
import { RecipeService } from '../Services/recipe.service';
import { Tags } from '../Models/Tags';
import {GlobalService} from "../Services/global.service";


@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css'],
})
export class TagsComponent implements OnInit {
  tags!:any;

  upTag = new Tags();

  constructor(
    private tagservice: TagService,

    private recipeService: RecipeService,private globalService:GlobalService
  ) {}

  ngOnInit(): void {
    this.getTags();
    
  }

  onLogoutClick(): void {
    this.globalService.logout().subscribe();
  }
  getTags() {
    this.recipeService.getTags().subscribe(
      (response) => {
        if (response) {
          this.tags = response;
        }
      },

      (error: any) => {
        console.log(error);
      }
    );
  }
  deleteTag(id: number) {
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
        this.tagservice.deleteTag(id).subscribe(
          (response: any) => {
            if (response.status == 200) {
              Swal.fire({
                title: 'Deleted!',
                text: 'Your Tag has been deleted.',
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
                text: 'Your Tag has been deleted.',
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
openUpdate(id:number){

  Swal.fire({
    title: 'Edit your Tag Title',
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Update',

  }).then((result) => {
    if (result.isConfirmed) {
      this.upTag.id=id ;
      this.upTag.title=result.value ;


console.log(this.upTag);

this.updateTag(this.upTag);


}
  })

}

  updateTag(tag:Tags){


this.tagservice.updateTag(tag).subscribe(
  (response: any) => {
    if (response) {

      Swal.fire({
        title: 'Nice',
        text: 'Tag updated !',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.value) {
          window.location.reload();
        }
      });
    } else {


      Swal.fire('Error', 'Try again', 'error');
    }


  },
  (error: any) => {

      console.log(error)

      Swal.fire('Error', 'Try again', 'error');
    }
);
  }
}
