import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { TagService } from '../Services/tag.service';
import {GlobalService} from "../Services/global.service";

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {
  TagForm!: FormGroup;
  newImage!: File;
  constructor(
    private formBuilder: FormBuilder, private tagservice: TagService,private globalService:GlobalService
  ) {}

  ngOnInit(): void {

    this.TagForm = this.formBuilder.group({
      title: new FormControl(''),
    });



  }

  onLogoutClick(): void {
    this.globalService.logout().subscribe();
  }
  onSubmit() {
    if (!this.TagForm.value.title  ) {

        Swal.fire('Fail', 'Please fill in all required field !', 'warning');


        return;
      }

      const formData = { title: this.TagForm.value.title };

this.tagservice.ajouterTag(formData).subscribe((response: any) => {
  if (response) {
    console.log(response);

    Swal.fire('Nice', 'Tag created !', 'success');
  }
  else{
    Swal.fire('Fail', 'error try again!', 'error');


  }
},
(error: any) => {

    console.log(error);
    Swal.fire('Fail', 'error try again!', 'error');

  }



);
}

}
