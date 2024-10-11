import { Component, OnInit } from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'front-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent  implements OnInit  {

  constructor(private spinner: NgxSpinnerService) {}
  ngOnInit() {
    this.spinner.show();


  }
}