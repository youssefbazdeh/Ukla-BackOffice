import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegistrationComponent} from './registration/registration.component';
import {MailVerificationComponent} from './mail-verification/mail-verification.component';
import {WaitingComponent} from './waiting/waiting.component';
import {LoginComponent} from './login/login.component';
import {AddRecipeComponent} from './add-recipe/add-recipe.component';
import {MenuComponent} from './menu/menu.component';
import {IngredientComponent} from './ingredient/ingredient.component';
import {UsersComponent} from './users/users.component';
import {TagComponent} from './tag/tag.component';
import {TagsComponent} from './tags/tags.component';
import {AllergiesComponent} from "./allergies/allergies.component";
import {EditAllergyComponent} from "./edit-allergy/edit-allergy.component";
import {AddAllergyComponent} from "./add-allergy/add-allergy.component";
import {AllergyComponent} from "./allergy/allergy.component";
import {RecipesComponent} from "./recipes/recipes.component";
import {EditStepComponent} from "./edit-step/edit-step.component";
import {StepsComponent} from "./steps/steps.component";
import {IngredientsComponent} from "./ingredients/ingredients.component";
import {EditIngredientComponent} from "./edit-ingredient/edit-ingredient.component";
import {EditRecipeComponent} from "./edit-recipe/edit-recipe.component";
import {ForgetPasswordComponent} from "./forget-password/forget-password.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import {TokenPasswordComponent} from "./token-password/token-password.component";
import { EditCreatorProfileComponent } from './edit-creator-profile/edit-creator-profile.component';
import { CreatorRecipesComponent } from './creator-recipes/creator-recipes.component';
import { CreatorRegistrationComponent } from './creator-registration/creator-registration.component';
import { ReviewRecipesComponent } from './review-recipes/review-recipes.component';
import { ReviewDetailComponent } from './review-detail/review-detail.component';
import { RoleGuardService } from './authGuard/role-guard.service';
import { AccessDeniedPageComponent } from './access-denied-page/access-denied-page.component';


const routes: Routes = [
  {path: '', redirectTo: 'Login', pathMatch: 'full'},
  {path: 'Registration', component: RegistrationComponent, title: "Registration"},
  {path: 'Waiting', component: WaitingComponent, title: "Waiting"},
  {path: 'AccessDenied', component: AccessDeniedPageComponent, title: "AccessDenied"},
  {path: 'Login', component: LoginComponent, title: "Login"},
  {path: 'Verification/:email', component: MailVerificationComponent, title: "Verification"},
  {path: 'AddRecipe', component: AddRecipeComponent, title: "AddRecipe",
  canActivate: [RoleGuardService],
  data: {
    expectedRole: ['ROLE_CREATOR']
  }},
  {path: 'Menu/1', component: MenuComponent, title: "Menu"},
  {path: 'AddIngredient', component: IngredientComponent, title: "AddIngredient",
  canActivate: [RoleGuardService],
  data: {
    expectedRole: ['ROLE_ADMIN']
  }},
  {path: 'Users', component: UsersComponent, title: "Users",
  canActivate: [RoleGuardService],
  data: {
    expectedRole: ['ROLE_ADMIN']
  }},
  {path: 'AddTag', component: TagComponent, title: "AddTag",
  canActivate: [RoleGuardService],
  data: {
    expectedRole: ['ROLE_ADMIN']
  }},
  {path: 'Tags', component: TagsComponent, title: "Tags",
  canActivate: [RoleGuardService],
  data: {
    expectedRole: ['ROLE_ADMIN']
  }},
  {path: 'Ingredients', component: IngredientsComponent, title: "Ingredients",
  canActivate: [RoleGuardService],
  data: {
    expectedRole: ['ROLE_ADMIN']
  }},

  {path: 'Allergies', component: AllergiesComponent, title: "Allergies",
  canActivate: [RoleGuardService],
  data: {
    expectedRole: ['ROLE_ADMIN']
  }},

  {path: 'EditAllergy/:id', component: EditAllergyComponent, title: "EditAllergy",
  canActivate: [RoleGuardService],
  data: {
    expectedRole: ['ROLE_ADMIN']
  }},
  {path: 'EditIngredient/:id', component: EditIngredientComponent, title: "EditIngredient",
  canActivate: [RoleGuardService],
  data: {
    expectedRole: ['ROLE_ADMIN']
  }},
  {path: 'EditRecipe/:id', component: EditRecipeComponent, title: "EditRecipe",
  canActivate: [RoleGuardService],
  data: {
    expectedRole: ['ROLE_ADMIN','ROLE_CREATOR']
  }},
  {path: 'AddAllergy', component: AddAllergyComponent, title: "AddAllergy",
  canActivate: [RoleGuardService],
  data: {
    expectedRole: ['ROLE_ADMIN']
  }},
  {path: 'Allergy/:id', component: AllergyComponent, title: "Allergy",
  canActivate: [RoleGuardService],
  data: {
    expectedRole: ['ROLE_ADMIN']
  }},


  {path: 'Recipes', component: RecipesComponent, title: "Recipes",
  canActivate: [RoleGuardService],
  data: {
    expectedRole: ['ROLE_ADMIN']
  }},
  {path: 'CreatorRecipes', component: CreatorRecipesComponent, title: "CreatorRecipes",
  canActivate: [RoleGuardService],
  data: {
    expectedRole: ['ROLE_CREATOR']
  }
  },
  {path: 'EditProfile', component: EditCreatorProfileComponent, title: "EditCreatorProfile",canActivate: [RoleGuardService],
  data: {
    expectedRole: ['ROLE_CREATOR']
  }},
  {path: 'CreatorRegistration', component: CreatorRegistrationComponent, title: "CreatorRegistration",canActivate: [RoleGuardService],
  data: {
    expectedRole: ['ROLE_CREATOR']
  }},
  {path: 'EditStep/:id', component: EditStepComponent, title: "editStep"},
  {path: 'Steps/:recipeN', component: StepsComponent, title: "steps"},
  {path: 'ForgetPassword', component: ForgetPasswordComponent, title: "ForgetPassword"},
  {path: 'ResetPassword/:token', component: ResetPasswordComponent, title: "ResetPassword"},
  {path: 'VerifiedTokenPassword', component: TokenPasswordComponent, title: "VerifiedTokenPassword"},
  {path: 'EditProfile', component: EditCreatorProfileComponent, title: "EditCreatorProfile"},
  {path: 'CreatorRegistration', component: CreatorRegistrationComponent, title: "CreatorRegistration"},
  {path: 'ReviewRecipes', component: ReviewRecipesComponent, title: "ReviewRecipes"},
  {path: 'ReviewDetail/:id', component: ReviewDetailComponent, title: "ReviewDetail"},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
