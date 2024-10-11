import {AfterViewInit, Component, HostListener} from '@angular/core';
import Swal from 'sweetalert2';
import {WaitService} from "../Service/wait.service";
import {HttpResponse} from "@angular/common/http";
import {wait} from "../Models/wait";
declare var $: any;

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements AfterViewInit {
  ngAfterViewInit() {
    $(window).scroll(() => this.onScroll());

    $('.back-to-top').click(() => this.onBackToTopClick());
  }

  onScroll() {
    if ($(window).scrollTop() > 300) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  }

  onBackToTopClick() {
    $('html, body').animate({ scrollTop: 0 }, 500, 'easeInOutExpo');
    return false;
  }

  @HostListener('window:scroll', ['$event'])
  onHostScroll(event: Event) {
    this.onScroll();
  }
email!:string;
  newWait = new wait();
  isLoading = false;

constructor(private waitServices: WaitService) {
}
onSubmit(){
  this.isLoading = true;
  console.log(this.newWait.email)
  if (!this.newWait.email ) {

    Swal.fire('Fail', 'Please fill in the required field !', 'warning');
    this.isLoading = false;

    return;
  }
  if (!this.newWait.email.match("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")) {
    Swal.fire('Fail', 'Invalid Email !', 'warning');
    this.isLoading = false;


    return;
  }

  this.waitServices.addSubscriber(this.newWait)
    .subscribe((response: HttpResponse<any>) => {
        if (response.status == 200) {
          this.isLoading = false;
          this.newWait.email="";

          Swal.fire('Nice', 'Subscribed  !', 'success');
        }
        else if (response.status == 302){
          this.isLoading = false;
          Swal.fire('Fail', 'Already Subscribed ', 'warning');

        }

        else{
          this.isLoading = false;
          Swal.fire('Fail', 'error try again!', 'error');

        }
      },
      (error: any) => {
        if (error.status == 200) {
          this.isLoading = false;
          this.newWait.email="";
          Swal.fire('Nice', 'Subscribed  !', 'success');
        }
        else if (error.status == 302){
          this.isLoading = false;
          Swal.fire('Fail', 'Already Subscribed ', 'warning');

        }

        else{
          this.isLoading = false;
          Swal.fire('Fail', 'error try again!', 'error');

        }

      }

    );

}

}
