import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LandingComponent} from "./landing/landing.component";
import {RecipeComponent} from "./recipe/recipe.component";
import {LoginToDeleteAccountComponent} from "./login-to-delete-account/login-to-delete-account.component";
import {DeleteAccountComponent} from "./delete-account/delete-account.component";
import {ForgetPasswordComponent} from "./forget-password/forget-password.component";
import{ResetPasswordComponent} from "./reset-password/reset-password.component";
import{TokenPasswordComponent} from "./token-password/token-password.component";
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsOfUsageComponent } from './terms-of-usage/terms-of-usage.component';



const routes: Routes = [

  {path: '', redirectTo: 'waitlist', pathMatch: 'full'},

  { path: 'waitlist', component: LandingComponent , title:"Ukla" },

  { path: 'recette', component: RecipeComponent , title:"recette" },
  { path: 'deleteAccount', component: LoginToDeleteAccountComponent , title:"deleteAccount" },
  { path: 'deleteAccountConfirmation', component: DeleteAccountComponent , title:"deleteAccountConfirmation" },
  { path: 'forgetPassword', component: ForgetPasswordComponent , title:"forgetPassword" },
  {path: 'resetPassword/:token', component: ResetPasswordComponent, title: "resetPassword"},
  {path: 'verifiedTokenPassword', component: TokenPasswordComponent, title: "verifiedTokenPassword"},
  {path: 'privacyPolicy', component: PrivacyPolicyComponent, title: "Privacy policy"},
  {path: 'termsOfUsage', component: TermsOfUsageComponent, title: "Terms of usage"},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
