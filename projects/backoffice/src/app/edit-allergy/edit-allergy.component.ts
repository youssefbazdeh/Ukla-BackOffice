import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Swal from "sweetalert2";
import {AllergyService} from "../Services/allergie.service";
import {ActivatedRoute} from "@angular/router";
import {LoaderService} from "../Services/loader.service";
import {HttpResponse} from "@angular/common/http";
import {Allergy} from "../Models/Allergy";
import {RecipeService} from "../Services/recipe.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {GlobalService} from "../Services/global.service";
import {IngredientService} from "../Services/ingredient.service";

@Component({
  selector: 'app-edit-allergy',
  templateUrl: './edit-allergy.component.html',
  styleUrls: ['./edit-allergy.component.css']
})
export class EditAllergyComponent implements OnInit {
  @ViewChild('fileInput', {static: true}) fileInputRef!: ElementRef<HTMLInputElement>;
  id!: number;
  newImage!: File;
  allergy = new Allergy();
  ingredientNames!: any[];
  ingredientIds: string="";
  AllergyForm!: FormGroup;
  selectedOption!: any;
  name!: string;
  checkedIngredients!: any; // Object to store checked state for each ingredient
  customPlaceholder = "Custom Placeholder Text";
  dropdownOpen = false;
  myArray: number[] = [];
  myString!: string
  filteredIng: any[] = [];
  selectedOptions: any[] = [];
  imagesToShow :SafeUrl[]=[];
  nbItem: number = 10;
  isDropdownOpen = false;
  @ViewChild('dropdownContent') dropdownContent!: ElementRef;
  showMoreVisible: boolean = true;
  constructor(private formBuilder: FormBuilder,
              private allergyService: AllergyService, private route: ActivatedRoute, private ingredientService: IngredientService,  private sanitizer: DomSanitizer,private globalService:GlobalService,public loaderService: LoaderService, private recipeService: RecipeService
  ) {
  }

  ngOnInit() {
    this.AllergyForm = this.formBuilder.group({
      name: new FormControl(""),


    });
    this.id = this.route.snapshot.params['id'];
    this.getIngridients(this.nbItem);
    this.getAllergy();


    const defaultFile = new File(['content of default file'], 'Image Added'); // Change this to your default file content
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(defaultFile);
    this.fileInputRef.nativeElement.files = dataTransfer.files;
  }

  search(searchTerm: string) {
    const searchTermLower = searchTerm.toLowerCase();
    console.log(searchTerm);
    this.filteredIng = this.ingredientNames.filter(ingredient => {
      const nameLower = ingredient.name.toLowerCase();

      return nameLower.includes(searchTermLower) ;
    });
  }

  removeIngredient(indexS: number, nameS: string) {

    if (indexS != -1) {
      this.selectedOptions.splice(indexS, 1);
      this.myArray.splice(indexS, 1);



      for (let k = 0; k < this.ingredientNames.length; k++) {
        if (this.ingredientNames[k].name == nameS) {
          this.ingredientNames[k].checked = false;

        }

      }


    }
  }

  getAllergy() {
    this.allergyService.getAllergyById(this.id
    ).subscribe(
      (response) => {
        if (response) {
          this.allergy.id = response.id;
          this.allergy.name = response.name;
          this.allergy.image=response.image;
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

          this.selectedOptions = response.ingredients;
          console.log(this.selectedOptions)

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

          console.log(this.ingredientNames);

          for (let index = 0; index < response.length; index++) {
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
            this.ingredientNames[index] = {
              name: response[index].name,
              image: response[index].image,
              checked: false,
            };
            for (let k = 0; k < this.selectedOptions.length; k++) {
              if (this.ingredientNames[index].name == this.selectedOptions[k].name) {
                this.ingredientNames[index].checked = true;
             this.myArray.push(this.selectedOptions[k].id)
                if (k==0){
                  this.ingredientIds+=this.selectedOptions[k].id;

                }
                else   if (k!=0 && this.ingredientIds)             { this.ingredientIds+=","+this.selectedOptions[k].id;}



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

  selectItem(option: any) {


    this.selectedOption = option;


  }

  onFileSelectedV(event: any) {
    this.newImage = event.target.files[0];

  }

  toggleSelection(option: any,id:number) {
    option.selected = !option.selected;

    if (option.selected) {
      this.selectedOptions.push(option);
      this.myArray.push(id);

      this.ingredientIds+=","+id;

      console.log( this.myArray);

    } else {
      const index = this.selectedOptions.findIndex(item => item === option);
      if (index !== -1) {
        this.selectedOptions.splice(index, 1);
        this.ingredientNames.splice(index, 1);
      }
    }

  }

  onSubmit() {

    const formData = new FormData();
    this.loaderService.setLoading(true);
    if (this.newImage){
      formData.append('image',  this.newImage);
      this.allergyService.updateImage(formData,this.id).subscribe((data: HttpResponse<any>) => {


      });}
    if(this.AllergyForm.value.name){
      this.allergy.name=this.AllergyForm.value.name;
    }
    const json1 = JSON.stringify(this.allergy);

    const allergy = new Blob([json1], {
      type: 'application/json'
    });


    formData.append('allergy', allergy);

    const json2 = JSON.stringify(this.ingredientIds);




    formData.append('IngredientsIds', this.myArray.join(', '));
    console.log(json1);



    this.allergyService.updateAllergy(formData).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status == 200) {
          this.loaderService.setLoading(false);
            Swal.fire('Nice', 'Allergy up to date !', 'success');


        }  else {
          this.loaderService.setLoading(false);
          Swal.fire('Fail', 'error occurred please try again !', 'error');
        }
      },

      (error: any) => {

        if (error.status == 200) {
          this.loaderService.setLoading(false);
          Swal.fire('Nice', 'Allergy up to date !', 'success');


        }  else {
          this.loaderService.setLoading(false);
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
