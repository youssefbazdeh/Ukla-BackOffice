import {Component, OnInit} from '@angular/core';
import {StepService} from "../Services/step.service";
import {ActivatedRoute} from "@angular/router";
import {LoaderService} from "../Services/loader.service";
import Swal from "sweetalert2";
import {HttpResponse} from "@angular/common/http";
import {GlobalService} from "../Services/global.service";
import {AuthService} from '../Services/auth.service';

@Component({
  selector: 'app-edit-step',
  templateUrl: './edit-step.component.html',
  styleUrls: ['./edit-step.component.css']
})
export class EditStepComponent implements OnInit{
  step:any;
  id!:number;
  newVideo! :File;
  url: string | null = null;
  currentUserRole!:string;


  constructor(
    private stepService: StepService, private route: ActivatedRoute,
    public loaderService: LoaderService,private globalService:GlobalService,private authService: AuthService
  ) {}
  ngOnInit() {
    this.id=this.route.snapshot.params['id'];
    this.authService.decodeJWT(window.sessionStorage.getItem("access-token"));
    this.currentUserRole=this.authService.role[0];
    this.getStep(this.id);
  }
  onLogoutClick(): void {
    this.globalService.logout().subscribe();
  }

  getStep(id: number) {
    this.stepService.getStep(id).subscribe(
      (response) => {
        if (response) {
          console.log(response)
          console.log(id)
          this.step = response;
  
          if (response.video != null) {
            this.globalService.getVideo(response.video.id).subscribe(
              (data: Blob) => {
                const videoUrl = URL.createObjectURL(data);
                this.url = videoUrl;
              },
              (error) => {
                console.error('Error fetching video', error);
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
  
  
  onFileSelectedV(event: any) {
    this.newVideo = event.target.files[0];

  }
  onSubmit(){
    if (!this.newVideo ) {

      Swal.fire('Fail', 'Please fill in all required fields !', 'warning');


      return;
    }
    this.loaderService.setLoading(true);

    const formData = new FormData();




    formData.append('video',  this.newVideo);
    this.stepService.editStepVideo(formData,this.id).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status==201) {
          this.loaderService.setLoading(false);
          Swal.fire('Nice', 'Video added !', 'success');


        }
        else if(response.status==204){
          this.loaderService.setLoading(false);

          Swal.fire('Fail', 'video not saved !', 'warning');

        }
        else        {        this.loaderService.setLoading(false);
          Swal.fire('Fail', 'error occurred !', 'error');
        }
      },

      (error: any) => {

        if (error.status==201) {
          this.loaderService.setLoading(false);
          Swal.fire('Nice', 'Video added !', 'success');


        }
        else if(error.status==204){
          this.loaderService.setLoading(false);

          Swal.fire('Fail', 'video not saved !', 'warning');

        }
        else        {        this.loaderService.setLoading(false);
          Swal.fire('Fail', 'error occurred !', 'error');
        }

      }
    );
  }


}
