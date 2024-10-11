import { Ingredient } from "./Ingredient";
import { Steps } from "./Steps";
import { Tags } from "./Tags";


export class Recipe{



  id!:number;
  name!: string;
  description !: string;
  preparationTime!: number;
  cookingTime !:number;
  calories !:number;
  ingredientQuantityObjects!:Ingredient
  steps!:Steps;
  tags!:Tags;
  video!:any;
  image!:any;

  }
