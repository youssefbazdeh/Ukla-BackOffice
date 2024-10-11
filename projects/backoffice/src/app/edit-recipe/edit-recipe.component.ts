import {AfterViewInit, Component,EventEmitter, ComponentFactoryResolver, ElementRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import { Validators } from '@angular/forms';
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {RecipeService} from "../Services/recipe.service";
import {LoaderService} from "../Services/loader.service";
import {ActivatedRoute, Router} from "@angular/router";
import Swal from "sweetalert2";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {GlobalService} from "../Services/global.service";
import {IngredientService} from "../Services/ingredient.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { StepService } from '../Services/step.service';
import { Observable, Subject, debounceTime } from 'rxjs';
import {AuthService} from '../Services/auth.service';
import { CommentComponent } from '../comment/comment.component';




@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.css']
})
export class EditRecipeComponent implements OnInit, AfterViewInit {
  @ViewChild('commentPlaceholder', { read: ViewContainerRef }) commentPlaceholder!: ViewContainerRef;
  private commentComponentInstance: any;
  CreatorUsername:any;
  recipeId:any;
   //showEditStepComponent: boolean = false;
  selectedStepIndex: number | null = null;

  isLoading: boolean = false;
  initialSteps: any;
  currentUserRole!:string;


  selectedVideos = new Map<number,File>();


  showEditStepComponent: boolean[] = [];


  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef;
  @ViewChild('videoStepPlayer', { static: false }) videoStepPlayer!: ElementRef;
  
  messageEvent = new EventEmitter<any>();
  messageEvent1 = new EventEmitter<any>();
  progress:any;
  remainingTime:any;
  videoPreview!: string | ArrayBuffer;

  tag: any[] = [];
  
  
  selectedIngredientUnitAlternatives: any[][] = [];

  selectedOption: any[][] = [[]];
  
  videoUrls: { [key: number]: string } = {};

  name!: string;
  newImage!: File;
  newVideo!: File;
  newStepVideo!: File;
  stepsN: number = -1;
  RecipeForm!: FormGroup;
  recipe!: any;
  step!: any;
  addedSteps!: any;
  url: string | ArrayBuffer | null | undefined;
  urlStep: string | ArrayBuffer | null | undefined;
  urlRecipe: string | ArrayBuffer | null | undefined;
  url1: string | ArrayBuffer | null | undefined;
  
  filteredIng: any[] = [];

  imagesToShow :SafeUrl[]=[];
  stepVideoUrls: string[] = [];
  
  nbItem: number = 10;
  isDropdownOpen = false;
  searchTerm$ = new Subject<string>();
  searchSubscription: any;
  @ViewChild('searchInput') searchInput!: ElementRef;

  @ViewChild('dropdownContent') dropdownContent!: ElementRef;
  showMoreVisible: boolean = true;
  constructor(
    private spinner: NgxSpinnerService,private componentFactoryResolver: ComponentFactoryResolver,
    private formBuilder: FormBuilder,private authService: AuthService,
    private recipeService: RecipeService,private stepService:StepService, public loaderService: LoaderService, private route: ActivatedRoute,private router:Router,
    private sanitizer: DomSanitizer,private globalService:GlobalService,private ingredientService: IngredientService, 
  
  ) {
  }
  ngAfterViewInit() {
    this.loadCommentComponent();
  }
  loadCommentComponent() {
    if (!this.commentComponentInstance) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(CommentComponent);
      this.commentComponentInstance = this.commentPlaceholder.createComponent(componentFactory).instance;
      this.commentComponentInstance.recipeName = this.name;
      this.commentComponentInstance.recipeID = this.recipeId;
      this.commentComponentInstance.CreatorUsername = this.CreatorUsername;
    }
  }

  ngOnInit(): void {
    this.name = this.route.snapshot.params['id'];

    this.RecipeForm = this.formBuilder.group({

      name: new FormControl(''),
      description: new FormControl(''),

      preparationTime: new FormControl(''),
      cookingTime: new FormControl(''),
      portions: new FormControl(''),
      calories: new FormControl(''),

      tags: this.formBuilder.array([]),
      steps: this.formBuilder.array([]),
    

    });
    this.authService.decodeJWT(window.sessionStorage.getItem("access-token"));
    this.currentUserRole=this.authService.role[0];
    

    this.getRecipe();
    this.getTags();
    this.getIngridientsNames(this.nbItem);

    this.initialSteps = this.RecipeForm.get('steps')?.value;
    this.searchSubscription = this.searchTerm$
      .pipe(debounceTime(500)) 
      .subscribe(searchTerm => this.search(searchTerm));
  }


  search(searchTerm: string) {
    this.ingredientService.searchIngredient(searchTerm).subscribe(
      (response) => {
        if (response) {
          
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
        
      }
    );

  }

  selectItem(option: any, i: number, j: number, o: number) {
    if (!this.selectedOption[i]) {
      this.selectedOption[i] = [];
    }

    


    this.selectedOption[i][j] = option;
    
    this.selectedOption[i][j].selectedIngredientUnitAlternatives= [];
            for (const unitAlternative of option.unitAlternatives) {
              this.selectedOption[i][j].selectedIngredientUnitAlternatives.push(unitAlternative.unit);
            }

    this.RecipeForm.value.steps[i].ingredientQuantityObjects[j].ingredient.name = option.name;
    this.RecipeForm.value.steps[i].ingredientQuantityObjects[j].ingredient.quantity = option.quantity;
    this.RecipeForm.value.steps[i].ingredientQuantityObjects[j].ingredient.unit = option.unit;
  }

  

  getTags() {
    this.recipeService.getTags().subscribe(
      (response) => {
        if (response) {
          for (let index = 0; index < response.length; index++) {
            this.tag[index] = {
              id: response[index].id,
              title: response[index].title,
              disable: false,
              fois: -1
            };


          }

        }
      },

      (error: any) => {
      }
    );
  }

 
  getRecipe() {
    this.recipeService.getRecipeByName(this.name).subscribe(
     
      (response: any) => {
        this.recipeId=response.id;
        this.CreatorUsername=response.creator.username;
        if (response) {
          this.recipe = response;
          this.initialSteps=response.steps
          if(response.image!=null){

            this.globalService.getImage(response.image.id).subscribe(
              (data: Blob) => {
                const objectURL = URL.createObjectURL(data);
                const safeURL = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                this.imagesToShow[response.image.id] = safeURL;
              },
              error => {
                console.error('Error fetching image', error);
              }
            );
          }
          this.initializeForm(response);
          if(response.video!=null){

            this.globalService.getVideo(response.video.id).subscribe(
              (data: Blob) => {
                const videoUrl = URL.createObjectURL(data);
                this.url = videoUrl;
              },
              error => {
                console.error('Error fetching video', error);
              }
            );
            }
          }
        }
        );
      }
        
        
          initializeForm(response: any) {
          this.RecipeForm = this.formBuilder.group({

            name: new FormControl(response.name),
            description: new FormControl(response.description),

            preparationTime: new FormControl(response.preparationTime),
            cookingTime: new FormControl(response.cookingTime),
            portions: new FormControl(response.portions),
            calories: new FormControl(response.calories),
            video: this.formBuilder.group({
              id: new FormControl(response.video ? response.video.id : null),
              location: new FormControl(response.video ? response.video.location : null),
              url: new FormControl(response.video ? response.video.sasUrl :null)
            }),
            tags: this.formBuilder.array([]),
            steps: this.formBuilder.array([]),
          });
            let indexTag = 0;

          while (response.tags[indexTag] !== undefined) {
            const TagForm = this.formBuilder.group({

              id: new FormControl(response.tags[indexTag].id),
            });
            this.tags.push(TagForm);
            indexTag++;
          }
          let indexStep = 0;
          let indexIngredientQuantityOjbect = 0;
          const steps = response.steps;
          while (steps[indexStep] !== undefined) {
            if(response.steps[indexStep].video){
              indexIngredientQuantityOjbect = 0
              const StepForm = this.formBuilder.group({
                id: new FormControl(response.steps[indexStep].id),
                instruction: new FormControl(response.steps[indexStep].instruction),
                tip: new FormControl(response.steps[indexStep].tip),
                video : this.formBuilder.group({
                  id: new FormControl(response.steps[indexStep].video ? response.steps[indexStep].video.id : null),
                  location: new FormControl(response.steps[indexStep].video ? response.steps[indexStep].video.location : null),
                  url: new FormControl(response.steps[indexStep].video ? response.steps[indexStep].video.sasUrl :null) // Add this line to store video URL
                }),        
                ingredientQuantityObjects: this.formBuilder.array([]),
              });
            
              this.steps.push(StepForm);
            }
            else{
              indexIngredientQuantityOjbect = 0
              const StepForm = this.formBuilder.group({
                id: new FormControl(response.steps[indexStep].id),
                instruction: new FormControl(response.steps[indexStep].instruction),
                tip: new FormControl(response.steps[indexStep].tip),      
                ingredientQuantityObjects: this.formBuilder.array([]),
              });
            
              this.steps.push(StepForm);

            }
      
  
      while (response.steps[indexStep].ingredientQuantityObjects[indexIngredientQuantityOjbect] !== undefined) {
        const IngredientSForm = this.formBuilder.group({
          id: new FormControl(response.steps[indexStep].ingredientQuantityObjects[indexIngredientQuantityOjbect].id),
          ingredient: this.formBuilder.group({ name: new FormControl(response.steps[indexStep].ingredientQuantityObjects[indexIngredientQuantityOjbect].ingredient.name) }),
          quantity: new FormControl(response.steps[indexStep].ingredientQuantityObjects[indexIngredientQuantityOjbect].quantity),
          unit: new FormControl(response.steps[indexStep].ingredientQuantityObjects[indexIngredientQuantityOjbect].unit),
        });
  
        const ingredientArray = this.getIngredientArray(indexStep);
        ingredientArray.push(IngredientSForm);
  
        if (!this.selectedOption[indexStep]) {
          this.selectedOption[indexStep] = [];
        }
  
        this.selectedOption[indexStep][indexIngredientQuantityOjbect] = response.steps[indexStep].ingredientQuantityObjects[indexIngredientQuantityOjbect].ingredient;
        this.selectedOption[indexStep][indexIngredientQuantityOjbect].selectedIngredientUnitAlternatives = [];
  
        for (const unitAlternative of response.steps[indexStep].ingredientQuantityObjects[indexIngredientQuantityOjbect].ingredient.unitAlternatives) {
          if (!this.selectedOption[indexStep][indexIngredientQuantityOjbect].selectedIngredientUnitAlternatives) {
            this.selectedOption[indexStep][indexIngredientQuantityOjbect].selectedIngredientUnitAlternatives = [];
          }
          this.selectedOption[indexStep][indexIngredientQuantityOjbect].selectedIngredientUnitAlternatives.push(unitAlternative.unit);
        }
  
        if (response.steps[indexStep].ingredientQuantityObjects[indexIngredientQuantityOjbect].ingredient.image != null) {
          this.globalService.getImage(response.steps[indexStep].ingredientQuantityObjects[indexIngredientQuantityOjbect].ingredient.image.id).subscribe(
            (data: Blob) => {
              const objectURL = URL.createObjectURL(data);
              const safeURL = this.sanitizer.bypassSecurityTrustUrl(objectURL);
              this.imagesToShow[response.steps[indexStep].ingredientQuantityObjects[indexIngredientQuantityOjbect].ingredient.image.id] = safeURL;
            },
            error => {
              console.error('Error fetching image', error);
            }
          );
        }
        
  
        indexIngredientQuantityOjbect++;
      }
      indexStep++;

    }
    this.step=steps;
// Subscribe to valueChanges for the video URL control
this.RecipeForm.get('steps')?.valueChanges.subscribe((steps: any[]) => {
// Loop through steps array to find the step with modified video
  steps.forEach((step, index) => {
    if (step.video.url) {
      console.log(`Step video URL changed for step ${index + 1}: ${step.video.url}`);
      // Trigger logic here to handle the modified step index
    }
  });
});
  }
        
      
  getStepVideoUrl(stepIndex: number): string | null {
    const stepControl = this.steps.at(stepIndex) as FormGroup;
    var videoUrlControl = stepControl.get('video.url') as FormControl;
    if (stepControl) {
      if (this.videoUrls[stepIndex]) {
        return this.videoUrls[stepIndex];
       }
       if ((videoUrlControl!==null && videoUrlControl !== undefined)||this.selectedVideos.has(stepIndex)) {
        var videoUrlControl = stepControl.get('video.url') as FormControl;
         const videoUrlControlString = videoUrlControl.value;
         // Check if videoUrlControlString is null
         if (videoUrlControlString === null) {
           // Handle the null case here. For example, return null or log an error.
           console.error('videoUrlControlString is null for step index:', stepIndex);
           return null; // or handle it differently as per your requirement
         }
   
         // Create a URL object only if videoUrlControlString is not null
         const urlObject = new URL(videoUrlControlString);
   
         // Extract the 'se' query parameter
         const expirationDate = urlObject.searchParams.get('se');
         if (expirationDate != null) {
           const expirationDateObject = new Date(expirationDate);
   
           // Get the current date and time
           const currentDate = new Date();
           if (expirationDateObject < currentDate) {
             this.globalService.updateSasUrl(videoUrlControlString)
               .subscribe(
                 (response: string) => {
                   console.log('Response:', response);
                   videoUrlControl.setValue(response);
                   console.log("url updated for step : " + stepIndex);
                 },
                 (error: any) => {
                   console.error(error);
                   if (error.status == 200) {
                    console.log("url updated ");
                   }
                 }
               );
           }
         }
   
         if (videoUrlControl) {
           // Refresh the video element
           if (this.videoStepPlayer && this.videoStepPlayer.nativeElement) {
              this.videoStepPlayer.nativeElement.load();
           }
           return videoUrlControl.value;
         }
         
       } else {
        return null;
       }
    }
    return null;
   }
   


  getRecipeVideoUrl(): string | null {
    const recipeControl = this.RecipeForm as FormGroup;
   
    if (recipeControl) {
       const urlRecipe = this.url; // Prioritize urlStep
       if (urlRecipe !== null && urlRecipe !== undefined) {
         return urlRecipe.toString();
       } else {
         var videoUrlControl = recipeControl.get('video.url') as FormControl;
         // Create a URL object
         const urlObject = new URL(videoUrlControl.value);
   
         // Extract the 'se' query parameter
         const expirationDate = urlObject.searchParams.get('se');
         if (expirationDate != null) {
           const expirationDateObject = new Date(expirationDate);
   
           // Get the current date and time
           const currentDate = new Date();
           if (expirationDateObject < currentDate) {   
             this.globalService.updateSasUrl(videoUrlControl.value)
               .subscribe(
                 (response: string) => {
                   console.log('Response:', response);
                   videoUrlControl.setValue(response);
                 },
                 (error: any) => {
                   console.error(error);
                 }
               );
           }
         }
   
         if (videoUrlControl) {
          // Refresh the video element
        if (this.videoPlayer && this.videoPlayer.nativeElement) {
          this.videoPlayer.nativeElement.load();
        }
           return videoUrlControl.value;
         }
       }
    }
    return null;
   }
    
   
  
  
  onLogoutClick(): void {
    this.globalService.logout().subscribe();
  }
  getIngridientsNames(itemN:number) {
    this.ingredientService.getAllIngredients(1, itemN).subscribe(
      (response) => {
        if (response) {
          
          this.filteredIng =response;
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
      }
    );
  }

  changeTags(event: any, i: number) {

    for (let indexe = 0; indexe < this.tag.length; indexe++) {
      if ((this.tag[indexe].disable == true) && (i == this.tag[indexe].fois)) {
        this.tag[indexe].disable = false;


        break;
      }

    }


    const index = event.target.value
    this.tag[index - 1].disable = true;
    this.tag[index - 1].fois = i;


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
    


    const StepForm = this.formBuilder.group({
      instruction: new FormControl(''),
      tip: new FormControl(''),
      video: this.formBuilder.group({
        id: new FormControl(null),
        location: new FormControl(null),
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
    delete this.videoUrls[index];
    const updatedVideos = new Map<number, any>();
    const updatedVideoUrls: { [key: number]: string } = {};
    // update selectedVideos
    this.selectedVideos.forEach((video, key) => {
      if (key > index) {
        updatedVideos.set(key - 1, video);
      } else {
        updatedVideos.set(key, video);
      }
    });
    this.selectedVideos = updatedVideos;

    // update videoUrls
 Object.keys(this.videoUrls).forEach((key) => {
  const numericKey = parseInt(key, 10); // Convert the key to a number
  if (numericKey > index) {
    updatedVideoUrls[numericKey - 1] = this.videoUrls[numericKey];
  } else {
    updatedVideoUrls[numericKey] = this.videoUrls[numericKey];
  }
});

this.videoUrls = updatedVideoUrls;
 }

  getIngredientArray(stepIndex: number): FormArray {
    const StepForm = this.steps.at(stepIndex) as FormGroup;
    return StepForm.get('ingredientQuantityObjects') as FormArray;
  }


  addIngredient(stepIndex: number) {
    const IngredientSForm = this.formBuilder.group({
      id:new FormControl(''),
      ingredient: this.formBuilder.group({ name: new FormControl('') }),
      quantity: ['', [Validators.min(0)]],
      unit: new FormControl(''),
    });
  
    const ingredientArray = this.getIngredientArray(stepIndex);
    ingredientArray.push(IngredientSForm);
    this.getIngridientsNames(this.nbItem);
  }
  

  removeIngredient(stepIndex: number, ingredientIndex: number) {
  const ingredientArray = this.getIngredientArray(stepIndex);
  
  ingredientArray.removeAt(ingredientIndex);
  this.selectedOption[stepIndex].splice(ingredientIndex, 1);
}


  onFileSelectedI(event: any) {

    this.newImage = event.target.files[0];
    if(this.newImage){


    const formData = new FormData();
    formData.append('image', this.newImage);
    this.recipeService.updateImage(formData,this.recipe.id) .subscribe(
      (response: HttpResponse<any>) => {

        if(response.status==200){

          Swal.fire('Nice', 'Image up to date !', 'success');

        }

      }
      ,
      error => {
        if(error.status==200){

          Swal.fire('Nice', 'Image up to date !', 'success');

        }
      });
    }
  }

    onFileSelectedRecipeVideo(event: any) {
      this.newVideo = event.target.files[0];
      if (this.newVideo) {
        var reader = new FileReader();
        this.url = null; // Clear the url variable
        reader.readAsDataURL(this.newVideo);
        reader.onload = (event) => {
          this.url = (<FileReader>event.target).result as string;
          // Refresh the video element
        if (this.videoPlayer && this.videoPlayer.nativeElement) {
          this.videoPlayer.nativeElement.load();
        }
        }
      }
    }
    
  
    
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
      }
    }
  }
  
  setStepVideoUrl(stepIndex: number, url: any) {
    const videoControl = this.RecipeForm.get(`steps.${stepIndex}.video.url`);
    console.log(this.RecipeForm.get(`steps.${stepIndex}.video.url`))
    if (videoControl) {
      videoControl.setValue(url);
    }
  }
   
    
      
      
   
  
  


  onSubmit() {
    if (!this.RecipeForm.value.name || !this.RecipeForm.value.description) {

      Swal.fire('Fail', 'Please fill in all required fields !', 'warning');


      return;
    }
    const initialStepsList = this.RecipeForm.value.steps;

    for (let index = 0; index < initialStepsList.length; index++) {

      const ingredients = initialStepsList[index].ingredientQuantityObjects;
      if (!initialStepsList[index].instruction) {

        Swal.fire('Fail', 'the Instruction field is required !', 'warning');
        return;
      }
    

      for (let ing = 0; ing < ingredients.length; ing++) {
        if ((!ingredients[ing].ingredient.name) || (!ingredients[ing].quantity) ||(!ingredients[ing].unit)) {
          
          Swal.fire('Fail', 'the Ingredient Name, quantity and unit fields are  required !', 'warning');
          console.log("error in "+ingredients[ing].name)

          return;
        }  
        if (ingredients[ing].quantity < 0) {
          // Quantity is negative
          Swal.fire('Fail', 'Quantity is negative', 'warning');
     

        return;
          
        }
      }
    }

    this.loaderService.setLoading(true);
  
    const formData = new FormData();
    const json = JSON.stringify(this.RecipeForm.value);
    console.log('Request Body:', json);
    const blob = new Blob([json], {
      type: 'application/json'
    });
    formData.append('recipe', blob);
    for (const [key, file] of this.selectedVideos.entries()) {
      formData.append(`${key}`, file);
      console.log('Request Body:', `selectedVideos[${key}]`, file);
    }
    
    
      this.recipeService.updateRecipe(formData,this.recipe.id)
        .subscribe(
          (event) => {
            if (event.type === 'progress') {
              // Handle progress 
              this.progress = event.progress;
              this.remainingTime = event.minutes;
              this.messageEvent.emit(this.progress)
              this.messageEvent1.emit(this.remainingTime)
           } else if (event.type === 'response') {
              // Handle response
              const response = event.response;
            if (response.status == 200) {
              this.loaderService.setLoading(false);
              if(this.currentUserRole== "ROLE_CREATOR"){
                Swal.fire('Nice', 'Recipe up to date !', 'success');
                this.router.navigate(['/CreatorRecipes']);
              }else{
                Swal.fire('Nice', 'Recipe up to date !', 'success');
                this.router.navigate(['/Recipes']);
              }
            }
            else {
              this.loaderService.setLoading(false);
              Swal.fire('Fail', 'error try again!', 'error');
            }
          }
          },
          (error: any) => {
            if (error.status == 400) {
              this.loaderService.setLoading(false);
              Swal.fire('Fail', 'Bad Request: Please check your request!', 'error');
            } else if (error.status == 200) {
              this.loaderService.setLoading(false);
              if(this.currentUserRole== "ROLE_CREATOR"){
                Swal.fire('Nice', 'Recipe up to date !', 'success');
                this.router.navigate(['/CreatorRecipes']);
              }else{
                Swal.fire('Nice', 'Recipe up to date !', 'success');
                this.router.navigate(['/Recipes']);
              }
            } else {
              this.loaderService.setLoading(false);
              Swal.fire('Fail', 'Error updating recipe. Please try again!', 'error');
            }
          }
        );
        if(this.newVideo){
          const formData = new FormData();
          formData.append('video', this.newVideo);
          this.recipeService.updateVideo(formData,this.recipe.id).subscribe(
            (event) => {
              
                Swal.fire('Nice', 'Video up to date !', 'success');
                
             
            },
            (error) => {
              Swal.fire('Fail', 'Error uploading video:', 'error');
            
              console.error('Error uploading video:', error);
            }
          );
        }
    }

  showMore() {
    this.nbItem+=10;
    this.getIngridientsNames(this.nbItem);
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
  onScroll() {
    const content = this.dropdownContent.nativeElement;
    if (content.scrollHeight - content.scrollTop <= content.clientHeight + 2) {
      this.showMoreVisible = true;
      this.nbItem+=10;
      this.getIngridientsNames(this.nbItem);
    }
  }
}
