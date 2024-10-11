import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import { AddRecipeComponent } from '../add-recipe/add-recipe.component';
import { EditRecipeComponent } from '../edit-recipe/edit-recipe.component';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class LoaderComponent  implements OnInit  {
  @Input() progress: number = 0; // Accept progress as an input
  progressIndicator:any;
  remainingTimeIndicator:any;
  indication:boolean =false;
  constructor(private spinner: NgxSpinnerService,private addRecipeComponent: AddRecipeComponent, private editComponent: EditRecipeComponent) {}
  ngOnInit() {
    this.spinner.show();
    this.addRecipeComponent.messageEvent.subscribe(progress => {
      this.indication=true
      this.progressIndicator=progress;
      
    });
    this.editComponent.messageEvent.subscribe(progress => {
      this.indication=true
      this.progressIndicator=progress;
      
    });
    this.addRecipeComponent.messageEvent1.subscribe(minutes => {
      this.indication=true
      this.remainingTimeIndicator=minutes;
      
    });
    this.editComponent.messageEvent1.subscribe(minutes => {
      this.indication=true
      this.remainingTimeIndicator=minutes;
      
    });

  }

}
