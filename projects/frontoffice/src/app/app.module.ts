import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {NgxSpinnerModule} from 'ngx-spinner';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgFor} from "@angular/common";
import { RecipeComponent } from './recipe/recipe.component';
import { ScreenshotComponent } from './screenshot/screenshot.component';
import {StringsManager} from "../../../backoffice/src/app/strings_manager";
import { PhoneCarouselComponent } from './phone-carousel/phone-carousel.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { TokenPasswordComponent } from './token-password/token-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoginToDeleteAccountComponent } from './login-to-delete-account/login-to-delete-account.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from "@angular/material/dialog";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoaderComponent } from './loader/loader.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsOfUsageComponent } from './terms-of-usage/terms-of-usage.component';



@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    RecipeComponent,
    ScreenshotComponent,
    PhoneCarouselComponent,
    DeleteAccountComponent,
    ForgetPasswordComponent,
    TokenPasswordComponent,
    LoginToDeleteAccountComponent,
    ResetPasswordComponent,
    LoaderComponent,
    PrivacyPolicyComponent,
    TermsOfUsageComponent,
    
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,

    NgFor,
      BrowserAnimationsModule,
      NgxSpinnerModule.forRoot({type: 'ball-scale-multiple'})

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  providers: [StringsManager],
  bootstrap: [AppComponent]
})
export class AppModule { }
