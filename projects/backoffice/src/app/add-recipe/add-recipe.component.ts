import {Steps} from './../Models/Steps';
import {Ingredient} from './../Models/Ingredient';
import {Recipe} from './../Models/Recipe';
import {RecipeService} from '../Services/recipe.service';
import Swal from 'sweetalert2';

import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import {HttpResponse} from '@angular/common/http';
import {LoaderService} from '../Services/loader.service';
import {Router} from "@angular/router";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {GlobalService} from "../Services/global.service";
import {IngredientService} from "../Services/ingredient.service";
import { Subject, debounceTime } from 'rxjs';
import {AuthService} from '../Services/auth.service';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.css'],

})
export class AddRecipeComponent implements OnInit {
  currentUserRole!:string;

  messageEvent = new EventEmitter<any>();
  messageEvent1 = new EventEmitter<any>();
  newStepVideo!: File;
  url: string | ArrayBuffer | null | undefined;
  videoUrls: { [key: number]: string } = {};
  selectedVideos = new Map<number,File>();
  showEditStepComponent: boolean[] = [];
  progress:any;
  remainingTime:any;
  ing: number = 0;
  myArray: any;
  tagT: any[] = [];
  ingredientN: any[] = [];

  ingredientNames: any[][] = [[]];
  selectedOption: any[][] = [[]];
  selectedIngredientUnitAlternatives: Map<string, string[]> = new Map();
 
  disabled: any;

  newImage!: File;
  newVideo!: File;
  stepsN: number = -1;
  RecipeForm!: FormGroup;
  selected: any = ['42976', '47883'];
  showItem = [{

    value: false,

  }];
  nbItem: number = 8;
  isDropdownOpen = false;
  filteredIng: any[] = [];
  selectedOptions: any[] = [];
  imagesToShow: SafeUrl[] = [];
  searchTerm$ = new Subject<string>();
  searchSubscription: any;
  @ViewChild('searchInput') searchInput!: ElementRef;
  
  @ViewChild('dropdownContent') dropdownContent!: ElementRef;
  constructor(
    private formBuilder: FormBuilder,private authService: AuthService,
    private recipeService: RecipeService, public loaderService: LoaderService, private router: Router,
    private sanitizer: DomSanitizer, private globalService: GlobalService, private ingredientService: IngredientService
  ) {

  }

  ngOnInit(): void {

    this.authService.decodeJWT(window.sessionStorage.getItem("access-token"));
    this.currentUserRole=this.authService.role[0];

    this.RecipeForm = this.formBuilder.group({
      name: new FormControl(''),
      description: new FormControl(''),

      preparationTime: new FormControl(''),
      cookingTime: new FormControl(''),
      portions: new FormControl(''),

      tags: this.formBuilder.array([]),
      steps: this.formBuilder.array([]),
    });

    this.getIngridientsNames();
    this.getIngridients(this.nbItem);
    this.getTags();
    this.searchSubscription = this.searchTerm$
      .pipe(debounceTime(500)) 
      .subscribe(searchTerm => this.search(searchTerm));


  }

 
    
  search(searchTerm: string) {
    this.ingredientService.searchIngredient(searchTerm).subscribe(
      (response) => {
        if (response) {
          this.ingredientN = response;
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

  toggleSelection(option: any, id: number) {
    option.selected = !option.selected;

    if (option.selected) {
      this.selectedOptions.push(option);


    } else {
      const index = this.selectedOptions.findIndex(item => item === option);
      if (index !== -1) {
        this.selectedOptions.splice(index, 1);
      }
    }

  }

  removeIngredientSelect(indexS: number, nameS: string) {

    if (indexS !== -1) {
      this.selectedOptions.splice(indexS, 1);


      for (let k = 0; k < this.ingredientNames.length; k++) {
        if (this.ingredientN[k].name == nameS) {
          this.ingredientN[k].checked = false;

        }

      }


    }
  }

  getIngridients(itemN: number) {
    this.ingredientService.getAllIngredients(1, itemN).subscribe(
      (response) => {
        if (response) {
          this.ingredientN = response;
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
          }

        }
      },

      (error: any) => {
        console.log(error);
      }
    );
   

  }

  selectItem(option: any, i: number, j: number, o: number) {

    if (!this.selectedOption[i]) {
      this.selectedOption[i] = [];
    }

    for (let indexe = 0; indexe < this.ingredientNames.length; indexe++) {
      if ((this.ingredientNames[i][indexe].disable == true) && (this.ingredientNames[i][indexe].foisI == j) && (this.ingredientNames[i][indexe].foisS == i)) {

        this.ingredientNames[i][indexe].disable = false;


        break;
      }

    }
     this.ingredientNames[i][o].disable = true;
    this.ingredientNames[i][o].foisI = j;
    this.ingredientNames[i][o].foisS = i;


    this.selectedOption[i][j] = option;
    
    const key = `${i}-${j}`; // Create a unique key for the combination of step and ingredient index
    const units = option.unitAlternatives.map((ua: { unit: string }) => ua.unit);
    this.selectedIngredientUnitAlternatives.set(key, units); // Set the units in the map
    console.log("unit alternatives : "+ option.unitAlternatives);
    console.log(option);

    this.RecipeForm.value.steps[i].ingredientQuantityObjects[j].ingredient.name = option.name


  }
  getUnitsForIngredient(step: number, ingredient: number): string[] {
    const key = `${step}-${ingredient}`;
    return this.selectedIngredientUnitAlternatives.get(key) || [];
   }
   

  onLogoutClick(): void {
    this.globalService.logout().subscribe();
  }

  getTags() {
    this.recipeService.getTags().subscribe(
      (response) => {
        if (response) {
          for (let index = 0; index < response.length; index++) {
            this.tagT[index] = {
              id: response[index].id,
              title: response[index].title,
              disable: false,
              fois: -1
            };


          }

        }
      },

      (error: any) => {
        console.log(error);
      }
    );
  }

  toggleItem(i: number) {
    this.showItem[i].value = true;
  }


  getIngridientsNames() {
    this.recipeService.getIngridientsNames().subscribe(
      (response) => {
        if (response) {

          for (let index = 0; index < response.length; index++) {
            if(response[index].image!=null){
              this.ingredientNames[0][index] = {
                name: response[index].name,
                image: response[index].image.id,
                unityalternatives: response[index].unitAltternatives,
                disable: false,
                foisI: -1,
                foisS: -1
              };
            }
            else{
              this.ingredientNames[0][index] = {
                name: response[index].name,
                unityalternatives: response[index].unitAltternatives,
                disable: false,
                foisI: -1,
                foisS: -1
              };

            }

           


          }

        }
      },

      (error: any) => {
         console.log(error);
      }
    );
  }

  changeTags(event: any, i: number) {

    for (let indexe = 0; indexe < this.tagT.length; indexe++) {
      if ((this.tagT[indexe].disable == true) && (i == this.tagT[indexe].fois)) {
        this.tagT[indexe].disable = false;


        break;
      }

    }

    const index = event.target.value
    this.tagT[index - 1].disable = true;
    this.tagT[index - 1].fois = i;

  }

  get steps(): FormArray {
    return this.RecipeForm.get('steps') as FormArray;
  }

  get ingredients(): FormArray {
    return this.RecipeForm.get('ingredientQuantityObjects') as FormArray;
  }

  addTag() {
    const TagForm = this.formBuilder.group({

      id: new FormControl(''),
    });


    this.tags.push(TagForm);
  }

  get tags(): FormArray {
    return this.RecipeForm.get('tags') as FormArray;
  }

  removeTag(index: number) {
    this.tags.removeAt(index);
  }

  addStep() {
    this.stepsN += 1;
    if (this.stepsN != 0) {
      this.ingredientNames[this.stepsN] = this.ingredientNames[0];


      for (let index = 0; index < this.ingredientNames[this.stepsN].length; index++) {

        this.ingredientNames[this.stepsN][index].disable = false;

      }
    }


    const StepForm = this.formBuilder.group({
      instruction: new FormControl(''),
      tip: new FormControl(''),
      video: this.formBuilder.group({
        id: new FormControl(''),
        location: new FormControl(''),
        sasUrl:new FormControl('')
      }),
      ingredientQuantityObjects: this.formBuilder.array([]),
    });

    this.steps.push(StepForm);

  }


  removeStep(index: number) {
    this.steps.removeAt(index);
    this.updateStepsvideoMap(index)
    
  }

  updateStepsvideoMap(index:number){
    this.selectedVideos.delete(index);

    const updatedVideos = new Map<number, any>();
    this.selectedVideos.forEach((video, key) => {
      if (key > index) {
        updatedVideos.set(key - 1, video);
      } else {
        updatedVideos.set(key, video);
      }
    });
    this.selectedVideos = updatedVideos;
 }

  getIngredientArray(stepIndex: number): FormArray {
    const StepForm = this.steps.at(stepIndex) as FormGroup;
    return StepForm.get('ingredientQuantityObjects') as FormArray;
  }


  addIngredient(stepIndex: number) {
    const IngredientSForm = this.formBuilder.group({
      ingredient: this.formBuilder.group({name: new FormControl(''),}),
      quantity: new FormControl(''),
      unit: new FormControl(''),
    });

    const ingredientArray = this.getIngredientArray(stepIndex);
    ingredientArray.push(IngredientSForm);
  }

  removeIngredient(stepIndex: number, ingredientIndex: number) {
    this.selectedOption[stepIndex][ingredientIndex] = null
    const ingredientArray = this.getIngredientArray(stepIndex);
    ingredientArray.removeAt(ingredientIndex);
  }

  onFileSelectedI(event: any) {
    this.newImage = event.target.files[0];

  }

  onFileSelectedV(event: any) {
    this.newVideo = event.target.files[0];

  }
  onFileSelectedVideo(event: any) {
    this.newStepVideo = event.target.files[0];
    if (this.newStepVideo) {
       var reader = new FileReader();
       this.url = null; // Clear the url variable
       reader.readAsDataURL(this.newStepVideo);
       reader.onload = (event) => {
         this.url = (<FileReader>event.target).result;
       }
    }
   }
   @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef;

 onFileSelectedStepVideo(event: any, stepIndex: number) {
    const newStepVideo = event.target.files[0];
    if (newStepVideo) {
      const reader = new FileReader();
      reader.readAsDataURL(newStepVideo);
      reader.onload = (event) => {
        const urlStep = (<FileReader>event.target).result as string;
        this.setStepVideoUrl(stepIndex, urlStep);
        // Push the selected video into the list
        this.videoUrls[stepIndex] = urlStep;
        this.selectedVideos.set(stepIndex,newStepVideo);
        // Refresh the video element
        if (this.videoPlayer && this.videoPlayer.nativeElement) {
          this.videoPlayer.nativeElement.load();
        }
      }
    }
 }

  setStepVideoUrl(stepIndex: number, url: any) {
    const videoControl = this.RecipeForm.get(`steps.${stepIndex}.video.sasUrl`);
    if (videoControl) {
      videoControl.setValue(url);
    }
  }

  getStepVideoUrl(stepIndex: number): string | null {
    const stepControl = this.steps.at(stepIndex) as FormGroup;
    var videoUrlControl = stepControl.get('video.url') as FormControl;
    if (stepControl) {
     if (this.videoUrls[stepIndex]) {
       return this.videoUrls[stepIndex];
    } if((videoUrlControl!==null && videoUrlControl !== undefined)||this.selectedVideos.has(stepIndex)) {
      var videoUrlControl = stepControl.get('video.url') as FormControl;
      const videoUrlControlString=videoUrlControl.value;
      // Create a URL object
      const urlObject = new URL(videoUrlControlString);

      // Extract the 'se' query parameter
      const expirationDate = urlObject.searchParams.get('se');
      if (expirationDate != null) {
        const expirationDateObject = new Date(expirationDate);

        // Get the current date and time
        const currentDate = new Date();
        if (expirationDateObject < currentDate) {
          console.log('The expiration date has passed.');
          this.globalService.updateSasUrl(videoUrlControlString)
               .subscribe(
                 (response: string) => {
                   videoUrlControl.setValue(response);

                 },
                 (error: any) => {
                   console.error(error);
                   if (error.status == 200) {
                 }
                }
                );
              } else {
            console.log('The expiration date has not passed.');
         }
         
         if (videoUrlControl) {
          return videoUrlControl.value;
      }
      else{
        return null;
      }
    }}
  }
  return null;

}
  showMore() {
    this.nbItem+=5;
    this.getIngridients(this.nbItem);
  }

  onSubmit() {
    if (!this.RecipeForm.value.name || !this.RecipeForm.value.description  || !this.RecipeForm.value.preparationTime
      || !this.RecipeForm.value.cookingTime  
      || !this.RecipeForm.value.portions  || !this.newImage || !this.newVideo ) {

      Swal.fire('Fail', 'Please fill in all required fields !', 'warning');


      return;
    }
    const steps = this.RecipeForm.value.steps;
    for (let i = 0; i < this.RecipeForm.value.steps.length; i++) {
      delete this.RecipeForm.value.steps[i].video;

   }

    for (let index = 0; index < steps.length; index++) {

      const ingredients = steps[index].ingredientQuantityObjects;
      if (!steps[index].instruction) {

        Swal.fire('Fail', 'the Instruction field is required !', 'warning');


        return;
      }

      for (let ing = 0; ing < ingredients.length; ing++) {
        if ((!ingredients[ing].ingredient.name) || (!ingredients[ing].quantity) || (!ingredients[ing].unit)) {

          Swal.fire('Fail', 'the Ingredient Name, quantity and unit fields are  required !', 'warning');


          return;
        }

      }
    }

    this.loaderService.setLoading(true);

    const formData = new FormData();
    const json = JSON.stringify(this.RecipeForm.value);
    const blob = new Blob([json], {
      type: 'application/json'
    });

    
    formData.append('recipe', blob);
    formData.append('image', this.newImage);
    formData.append('video', this.newVideo);
    for (const [key, file] of this.selectedVideos.entries()) {
      formData.append(`${key}`, file);
      console.log('Request Body:', `selectedVideos[${key}]`, file);
    }

    this.recipeService.ajouterRecipe(formData).subscribe(event => {
      if (event.type === 'progress') {
         // Handle progress 
         this.progress = event.progress;
         this.remainingTime = event.minutes;
         this.messageEvent.emit(this.progress)
         this.messageEvent1.emit(this.remainingTime)
      } else if (event.type === 'response') {
         // Handle response
         const response = event.response;
         if (response.status == 201) {
           Swal.fire('Nice', 'Recipe created !', 'success');
           this.router.navigate(['/Steps/'+`${this.RecipeForm.value.name}`]);
           this.loaderService.setLoading(false);

         } else if (response.status == 302) {
           this.loaderService.setLoading(false);
           Swal.fire('Fail', 'Recipe name exists!', 'warning');
         } else if (response.status == 304) {
           this.loaderService.setLoading(false);
           Swal.fire('Fail', 'Image not saved!', 'warning');
         } else if (response.status == 204) {
           this.loaderService.setLoading(false);
           Swal.fire('Fail', "couldn't save video!", 'warning');
         } else {
           this.loaderService.setLoading(false);
           Swal.fire('Fail', 'error try again!', 'error');
         }
      }
     }, error => {
      if (error.status == 201) {
        Swal.fire('Nice', 'Recipe created !', 'success');
        this.router.navigate(['/Steps/'+`${this.RecipeForm.value.name}`]);
        this.loaderService.setLoading(false);

      } else if (error.status == 302) {
        this.loaderService.setLoading(false);

        Swal.fire('Fail', 'Recipe name exists!', 'warning');

      } else if (error.status == 304) {
        this.loaderService.setLoading(false);

        Swal.fire('Fail', 'Image not saved!', 'warning');

      } else if (error.status == 204) {
        this.loaderService.setLoading(false);

        Swal.fire('Fail', "couldn't save video!", 'warning');

      } else {
        this.loaderService.setLoading(false);
        Swal.fire('Fail', 'error try again!', 'error');

      }

    });
  }


  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      }, 0);
   }
  }

  onScroll():void {
    const content = this.dropdownContent.nativeElement;
    if (content.scrollHeight - content.scrollTop <= content.clientHeight + 2) {      
      this.nbItem+=5;
      this.getIngridients(this.nbItem);
    }
  }



   
}
