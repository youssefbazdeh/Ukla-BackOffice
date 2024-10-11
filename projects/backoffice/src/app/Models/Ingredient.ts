import { UnitAlternative } from "./UnitAlternative";

export class Ingredient {
  id!: number;
  name!: string;
  type!: string;
  nbrCalories100gr!: number;
  unit!: number; //todo delete ? see if it's used or not  

  unitAltternatives! : UnitAlternative[] ; 

  fat!: number;
  image!: File;
  protein!: number;

  carbs!: number;

  sugar!: number;

  fiber!: number;

  saturatedFattyAcids!: number;

  cholesterol!: number;

  calcium!: number;

  magnesium!: number;

  sodium!: number;

  zinc!: number;

  iron!: number;
}
