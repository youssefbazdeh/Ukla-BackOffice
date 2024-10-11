import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {IngredientService} from "../Services/ingredient.service";
import {LoaderService} from "../Services/loader.service";
import Swal from "sweetalert2";
import {HttpResponse} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Ingredient} from "../Models/Ingredient";
import {GlobalService} from "../Services/global.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-edit-ingredient',
  templateUrl: './edit-ingredient.component.html',
  styleUrls: ['./edit-ingredient.component.css']
})
export class EditIngredientComponent  implements OnInit {
  languages = [
    { value: 'ar', label: 'Arabic' },
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'French' }
   ];
   
  IngredientForm!: FormGroup;
  newImage!: File;
  ingredient:any;
  id!:number;
  imagesToShow :SafeUrl[]=[];
  selectedLanguages: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private ingredientService: IngredientService,private route: ActivatedRoute,public loaderService: LoaderService,
  private sanitizer: DomSanitizer , public globalService: GlobalService, private router: Router,
  ) {}

  submitted = false;
  ngOnInit(): void {
    this.id=this.route.snapshot.params['id'];
    this.IngredientForm = this.formBuilder.group({
      id: new FormControl(''),
      name: new FormControl(''),
      type: new FormControl(''),
      nbrCalories100gr: new FormControl(''),
      fat: new FormControl(''),
      protein: new FormControl(''),
      carbs: new FormControl(''),
      sugar: new FormControl(''),
      fiber: new FormControl(''),
      saturatedFattyAcids: new FormControl(''),
      cholesterol: new FormControl(''),
      calcium: new FormControl(''),
      magnesium: new FormControl(''),
      sodium: new FormControl(''),
      zinc: new FormControl(''),
      iron: new FormControl(''),
      unitAlternatives: this.formBuilder.array([
        this.formBuilder.group({
          unit: new FormControl('', [Validators.required]),
          conversionRate: new FormControl('', [Validators.required])
        })
      ]),
      translatedIngredients: this.formBuilder.array([
        this.formBuilder.group({
          name: new FormControl('', [Validators.required]),
          languageCode: new FormControl('', [Validators.required])
        })
      ]) 
    });

    this.getIngredient();
  }

  addLanguage() {
    const translatedIngredient = this.formBuilder.group({
      name: new FormControl(''),
      languageCode: new FormControl('')
    });
    (this.IngredientForm.get('translatedIngredients') as FormArray).push(translatedIngredient);
  }
  removeLanguage(index: number) {
  (this.IngredientForm.get('translatedIngredients') as FormArray).removeAt(index);
  }
  get translatedIngredients(): FormArray {
    return this.IngredientForm.get('translatedIngredients') as FormArray;
  }

  addUnitAlternative() {
    const unitAlternative = this.formBuilder.group({
      unit: new FormControl(''),
      conversionRate: new FormControl('')
    });
    (this.IngredientForm.get('unitAlternatives') as FormArray).push(unitAlternative);
 }
 removeUnitAlternative(index: number) {
  (this.IngredientForm.get('unitAlternatives') as FormArray).removeAt(index);
}

  onLogoutClick(): void {
    this.globalService.logout().subscribe();
  }
  getIngredient() {
    this.ingredientService.getById(this.id).subscribe(
       (response) => {
         if (response) {
           this.ingredient = response;
   
           if (this.ingredient.image) {
             this.globalService.getImage(response.image.id).subscribe(
               (data: Blob) => {
                 const objectURL = URL.createObjectURL(data);
                 const safeURL = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                 this.imagesToShow[response.image.id] = safeURL;
                 console.log(this.imagesToShow[response.image.id]);
               },
               error => {
                 console.error('Error fetching image', error);
               }
             );
           }
   
           this.IngredientForm = this.formBuilder.group({
             id: new FormControl(this.id),
             name: new FormControl(this.ingredient.name),
             type: new FormControl(this.ingredient.type),
             nbrCalories100gr: new FormControl(this.ingredient.nbrCalories100gr),
             fat: new FormControl(this.ingredient.fat),
             protein: new FormControl(this.ingredient.protein),
             carbs: new FormControl(this.ingredient.carbs),
             sugar: new FormControl(this.ingredient.sugar),
             fiber: new FormControl(this.ingredient.fiber),
             saturatedFattyAcids: new FormControl(this.ingredient.saturatedFattyAcids),
             cholesterol: new FormControl(this.ingredient.cholesterol),
             calcium: new FormControl(this.ingredient.calcium),
             magnesium: new FormControl(this.ingredient.magnesium),
             sodium: new FormControl(this.ingredient.sodium),
             zinc: new FormControl(this.ingredient.zinc),
             iron: new FormControl(this.ingredient.iron),
             unitAlternatives: this.formBuilder.array([]),
             translatedIngredients: this.formBuilder.array([]),
           });
   
           if (this.ingredient.unitAlternatives && this.ingredient.unitAlternatives.length) {
             const unitAlternativesFormArray = this.IngredientForm.get('unitAlternatives') as FormArray;
             this.ingredient.unitAlternatives.forEach((unitAlternative: any) => {
               unitAlternativesFormArray.push(this.formBuilder.group({
                 unit: [unitAlternative.unit, Validators.required],
                 conversionRate: [unitAlternative.conversionRate, Validators.required],
                 // Add other properties of unitAlternative here
               }));
             });
           }
   
           if (this.ingredient.translatedIngredients && this.ingredient.translatedIngredients.length) {
             const translatedIngredientsFormArray = this.IngredientForm.get('translatedIngredients') as FormArray;
             this.ingredient.translatedIngredients.forEach((translatedIngredients: any) => {
               translatedIngredientsFormArray.push(this.formBuilder.group({
                 name: [translatedIngredients.name, Validators.required],
                 languageCode: [translatedIngredients.languageCode, Validators.required],
               }));
             });
   
             // Initialize selectedLanguages with the languages that are already selected
             this.selectedLanguages = this.ingredient.translatedIngredients.map((ingredient: { languageCode: string }) => ingredient.languageCode);
           }
   
           // Subscribe to value changes of translatedIngredients
           const translatedIngredients = this.IngredientForm.get('translatedIngredients');
           if (translatedIngredients) {
             translatedIngredients.valueChanges.subscribe(values => {
               this.selectedLanguages = values.map((ingredient: { languageCode: string }) => ingredient.languageCode);
             });
           }
         }
       },
       (error: any) => {
         console.log(error);
       }
    );
   }
   
   
  onFileSelectedI(event: any) {
    this.newImage = event.target.files[0];

  }
  get unitAlternatives(): FormArray {
    return this.IngredientForm.get('unitAlternatives') as FormArray;
  }

  onSubmit() {
    this.submitted = true;
    if (!this.IngredientForm.value.name || !this.IngredientForm.value.type  ) {

      Swal.fire('Fail', 'Please fill in all required fields !', 'warning');


      return;
    }
    const formData = new FormData();
    this.loaderService.setLoading(true);
    if (this.newImage){
      formData.append('image',  this.newImage);
      this.ingredientService.updateImage(formData,this.id).subscribe((data: HttpResponse<any>) => {


      });


    }
    this.IngredientForm.value.id=Number(this.id);

    const json = JSON.stringify(this.IngredientForm.value);
    const blob = new Blob([json], {
      type: 'application/json'
    });


    formData.append('ingredient',  blob);

    this.ingredientService.updateIngredient(formData).subscribe((response: HttpResponse<any>) => {
        if (response.status == 200) {
          this.loaderService.setLoading(false);
          this.router.navigate(["Ingredients"]);

          Swal.fire('Nice', 'Ingredient up to date !', 'success');
        }
        else{
          this.loaderService.setLoading(false);

          Swal.fire('Fail', 'error try again!', 'error');

        }
      },
      (error: any) => {

        if (error.status == 200) {

          this.loaderService.setLoading(false);
          Swal.fire('Nice', 'Ingredient up to date !', 'success');
          this.router.navigate(["Ingredients"]);
        }
        else{
          this.loaderService.setLoading(false);

          Swal.fire('Fail', 'error try again!', 'error');


        }

      }

    );
  }
}
