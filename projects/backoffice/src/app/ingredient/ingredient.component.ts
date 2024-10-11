import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RecipeService } from '../Services/recipe.service';
import { IngredientService } from '../Services/ingredient.service';
import { HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import {LoaderService} from "../Services/loader.service";
import {GlobalService} from "../Services/global.service";
import { Router } from '@angular/router';
@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.css']
})
export class IngredientComponent implements OnInit {
  IngredientForm!: FormGroup;
  newImage!: File;
  selectedLanguages: string[] = [];

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private ingredientService: IngredientService,public loaderService: LoaderService,private globalService:GlobalService
  ) {}

  submitted = false;

  ngOnInit(): void {
    this.IngredientForm = this.formBuilder.group({
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
          languageCode: new FormControl('', [Validators.required, this.languageNotSelected(this.selectedLanguages)])
        })
      ])
    });

    const translatedIngredients = this.IngredientForm.get('translatedIngredients');
    if (translatedIngredients) {
      translatedIngredients.valueChanges.subscribe((values: { languageCode: string }[]) => {
        this.selectedLanguages = values.map(ingredient => ingredient.languageCode);
      });
   }
 }
// Define the custom validator function here
 languageNotSelected(selectedLanguages: string[]): (control: FormControl) => { [key: string]: boolean } | null {
  return (control: FormControl): { [key: string]: boolean } | null => {
    const languageCode = control.value;
    if (selectedLanguages.includes(languageCode)) {
      return { 'languageAlreadySelected': true };
    }
    return null;
  };
}
  addLanguage() {
    const translatedIngredient = this.formBuilder.group({
      languageCode: new FormControl('', [Validators.required, this.languageNotSelected(this.selectedLanguages)]),
      name: new FormControl('', Validators.required)
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

get unitAlternatives(): FormArray {
  return this.IngredientForm.get('unitAlternatives') as FormArray;
}




  onLogoutClick(): void {
    this.globalService.logout().subscribe();
  }
  onFileSelectedI(event: any) {
    this.newImage = event.target.files[0];

  }
  onSubmit() {
    this.submitted = true;
    if (!this.IngredientForm.value.name || !this.IngredientForm.value.type || !this.newImage ) {

        Swal.fire('Fail', 'Please fill in all required fields !', 'warning');
        return;
      }
    this.loaderService.setLoading(true);

    const formData = new FormData();
    const json = JSON.stringify(this.IngredientForm.value);
    console.log(this.IngredientForm.value) //todo delete log 
    const blob = new Blob([json], {
      type: 'application/json'
    });


    formData.append('ingredient',  blob);
    formData.append('image',  this.newImage,this.newImage.name);

    console.log(formData.get("ingredient"));

    console.log(formData.get("image"));
this.ingredientService.ajouterIngredient(formData).subscribe((response: HttpResponse<any>) => {
      console.log(response)

  if (response.status == 201) {
    this.loaderService.setLoading(false);

    Swal.fire('Nice', 'Ingredient created !', 'success');
    this.router.navigate(["Ingredients"]);

  }
  else{
    this.loaderService.setLoading(false);

    Swal.fire('Fail', 'error try again!', 'error');

  }
},
(error: any) => {
  if (error.status == 201) {
    this.loaderService.setLoading(false);


    Swal.fire('Nice', 'Ingredient created !', 'success');
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
