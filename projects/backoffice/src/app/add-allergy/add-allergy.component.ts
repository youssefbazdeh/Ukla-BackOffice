import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Allergy} from "../Models/Allergy";
import {AllergyService} from "../Services/allergie.service";
import {ActivatedRoute} from "@angular/router";
import {LoaderService} from "../Services/loader.service";
import {RecipeService} from "../Services/recipe.service";
import Swal from "sweetalert2";
import {HttpResponse} from "@angular/common/http";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {GlobalService} from "../Services/global.service";
import {IngredientService} from "../Services/ingredient.service";
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-add-allergy',
  templateUrl: './add-allergy.component.html',
  styleUrls: ['./add-allergy.component.css']
})
export class AddAllergyComponent  implements OnInit{
  id!:number;
  newImage! :File;
  newAllergy=new Allergy();
  ingredientNames: any[]=[];
  ingredientIds: string="";
  AllergyForm!: FormGroup;
  selectedOption!:any;
  idx:number=0;
  filteredIng: any[] = [];
  selectedOptions: any[] = [];
  imagesToShow :SafeUrl[]=[];
  nbItem: number = 10;
  isDropdownOpen = false;
  searchTerm$ = new Subject<string>();
  searchSubscription: any;

  @ViewChild('dropdownContent') dropdownContent!: ElementRef;
  showMoreVisible: boolean = true;
  constructor(private formBuilder: FormBuilder,
              private allergyService: AllergyService, private route: ActivatedRoute, private ingredientService: IngredientService,public loaderService: LoaderService,private recipeService: RecipeService,private sanitizer: DomSanitizer,private globalService:GlobalService
  ) {}
  ngOnInit() {
    this.AllergyForm = this.formBuilder.group({
      name: new FormControl(''),





    });
    this.getIngridients(this.nbItem);
    this.searchSubscription = this.searchTerm$
      .pipe(debounceTime(500)) 
      .subscribe(searchTerm => this.search(searchTerm));
  }


  search(searchTerm: string) {
    this.ingredientService.searchIngredient(searchTerm).subscribe(
      (response) => {
        if (response) {
          this.ingredientNames = response;
          this.filteredIng = response;
          for (let index = 0; index < response.length; index++) {
            if(response[index].image!=null){
              this.globalService.getImage(response[index].image.id).subscribe(
                (data: Blob) => {
                 const objectURL = URL.createObjectURL(data);
                 const safeURL = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                 this.imagesToShow[response[index].image.id] = safeURL;
                },
                error => {
                   console.error('Error fetching image', error);
                }
              );
            }

            this.filteredIng[index] = {
              name: response[index].name,
              image: response[index].image,
              unitAlternatives:response[index].unitAlternatives,
              checked: false,
            };
            for (let k = 0; k < this.selectedOptions.length; k++) {
              if (this.filteredIng[index].name == this.selectedOptions[k].name) {
                this.filteredIng[index].checked = true;
              }
            }
          }
        }
      },
      (error: any) => {
         console.log(error);
      }
    );
 }
  onLogoutClick(): void {
    this.globalService.logout().subscribe();
  }
  getIngridients(itemN:number) {
    this.ingredientService.getAllIngredients(1, itemN).subscribe(
      (response) => {
        if (response) {
          this.ingredientNames = response;
          this.filteredIng = response;

          for (let index = 0; index < response.length; index++) {

            if(response[index].image!=null){

              this.globalService.getImage(response[index].image.id).subscribe(
                (data: Blob) => {
                  console.log(data)
                  const objectURL = URL.createObjectURL(data);
                  const safeURL = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                  this.imagesToShow[response[index].image.id]=safeURL;
                },
                error => {
                  console.error('Error fetching image', error);
                }
              );

            }

            this.ingredientNames[index] = {
              name: response[index].name,
              image: response[index].image,
              checked: false,
            };
            for (let k = 0; k < this.selectedOptions.length; k++) {
              if (this.ingredientNames[index].name == this.selectedOptions[k].name) {
                this.ingredientNames[index].checked = true;


              }

            }


          }

        }
      },

      (error: any) => {
        console.log(error);
      }
    );
    console.log(this.ingredientNames)

  }
  selectItem(option: any, id: number) {
    const index = this.selectedOptions.findIndex(item => item.name === option.name);
    if (index === -1) {
      this.selectedOptions.push(option);
      option.selected = true;
      this.updateIngredientIds();
    } else {
      this.selectedOptions.splice(index, 1);
      option.selected = false;
      this.updateIngredientIds();
    }
    console.log(this.selectedOptions);
  }

  onFileSelectedV(event: any) {
    this.newImage = event.target.files[0];

  }
  removeSelectedItem(option: any) {
    const index = this.selectedOptions.findIndex(item => item.name === option.name);
    if (index !== -1) {
      this.selectedOptions.splice(index, 1);
      option.selected = false;
      this.updateIngredientIds();
    }
  }

  removeIngredient(indexS: number, nameS: string) {
    if (indexS !== -1) {
      this.selectedOptions.splice(indexS, 1);
      for (let k = 0; k < this.ingredientNames.length; k++) {
        if (this.ingredientNames[k].name === nameS) {
          this.ingredientNames[k].checked = false;
        }
      }
    }
  }

  updateIngredientIds() {
    this.ingredientIds = this.selectedOptions.map(option => option.id).join(',');
  }

  toggleSelection(option: any,id:number) {
    option.selected = !option.selected;

    if (option.selected) {
      this.selectedOptions.push(option);
      if(this.idx==0){
        this.ingredientIds+=id;
        this.idx+=1;

      }
      else {
        this.ingredientIds+=","+id;

      }
      console.log(this.ingredientIds);


    } else {
      const index = this.selectedOptions.findIndex(item => item === option);
      if (index !== -1) {
        this.selectedOptions.splice(index, 1);
      }
    }

  }
  onSubmit(){
    if (!this.newImage ) {

      Swal.fire('Fail', 'Please fill in all required fields !', 'warning');


      return;
    }
    this.loaderService.setLoading(true);

    const formData = new FormData();
    const json = JSON.stringify(this.AllergyForm.value);

    const allergy = new Blob([json], {
      type: 'application/json'
    });


    formData.append('allergy', allergy);



    formData.append('IngredientsIds', this.ingredientIds);




    formData.append('image',  this.newImage);
    this.allergyService.addAllergy(formData).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status==201) {
          this.loaderService.setLoading(false);
          Swal.fire('Nice', 'Allergy Created !', 'success');


        }
        else if (response.status==302){
          this.loaderService.setLoading(false);
          Swal.fire('Fail', 'Allergy name already exists !', 'warning');
        }
        else        {        this.loaderService.setLoading(false);
          Swal.fire('Fail', 'error occurred please try again !', 'error');
        }
      },

      (error: any) => {

        if (error.status==201) {
          this.loaderService.setLoading(false);
          Swal.fire('Nice', 'Allergy Created !', 'success');


        }
        else if (error.status==302){
          this.loaderService.setLoading(false);
          Swal.fire('Fail', 'Allergy name already exists !', 'warning');
        }
        else        {        this.loaderService.setLoading(false);
          Swal.fire('Fail', 'error occurred please try again !', 'error');
        }
      }
    );
  }



  showMore() {
    this.nbItem+=10;
    this.getIngridients(this.nbItem);
  }
  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  onScroll() {
    const content = this.dropdownContent.nativeElement;
    if (content.scrollHeight - content.scrollTop <= content.clientHeight + 2) {
      this.showMoreVisible = true;
      this.nbItem+=10;
      this.getIngridients(this.nbItem);
    }
  }
}
