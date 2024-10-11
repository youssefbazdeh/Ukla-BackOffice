import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {NgFor} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {NgxSpinnerModule} from 'ngx-spinner';
import {TagComponent} from './tag/tag.component';
import {TagsComponent} from './tags/tags.component';
import {RegistrationComponent} from "./registration/registration.component";
import {MailVerificationComponent} from "./mail-verification/mail-verification.component";
import {WaitingComponent} from "./waiting/waiting.component";
import {LoginComponent} from "./login/login.component";
import {AddRecipeComponent} from "./add-recipe/add-recipe.component";
import {MenuComponent} from "./menu/menu.component";
import {IngredientComponent} from "./ingredient/ingredient.component";
import {UsersComponent} from "./users/users.component";
import {StringsManager} from "./strings_manager";
import {EditIngredientComponent} from './edit-ingredient/edit-ingredient.component';
import {IngredientsComponent} from './ingredients/ingredients.component';
import {RecipesComponent} from './recipes/recipes.component';
import {AllergiesComponent} from './allergies/allergies.component';
import {StepsComponent} from './steps/steps.component';
import {LoaderComponent} from './loader/loader.component';
import {AllergyComponent} from './allergy/allergy.component';
import {AddAllergyComponent} from './add-allergy/add-allergy.component';
import {EditAllergyComponent} from './edit-allergy/edit-allergy.component';
import {EditStepComponent} from './edit-step/edit-step.component';
import {EditRecipeComponent} from './edit-recipe/edit-recipe.component';
import {EditUserComponent} from './edit-user/edit-user.component';
import {ForgetPasswordComponent} from './forget-password/forget-password.component';
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import {MatDialogModule} from "@angular/material/dialog";
import {TokenPasswordComponent} from "./token-password/token-password.component";
import { EditCreatorProfileComponent } from './edit-creator-profile/edit-creator-profile.component';
import { CreatorMenuComponent } from './creator-menu/creator-menu.component';
import { CreatorRecipesComponent } from './creator-recipes/creator-recipes.component';

import { CreatorRegistrationComponent } from './creator-registration/creator-registration.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Interceptor } from './Services/interceptor';
import { ReviewRecipesComponent } from './review-recipes/review-recipes.component';
import { ReviewDetailComponent } from './review-detail/review-detail.component';
import { CommentComponent } from './comment/comment.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { AccessDeniedPageComponent } from './access-denied-page/access-denied-page.component';
import { ImageCropperModule } from 'ngx-image-cropper'; // Import the ImageCropperModule from the correct package
import { SpeedTestModule } from 'ng-speed-test';




@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    MailVerificationComponent,
    WaitingComponent,
    LoginComponent,
    AddRecipeComponent,
    MenuComponent,
    IngredientComponent,
    UsersComponent,
    TagComponent,
    TagsComponent,
    EditIngredientComponent,
    IngredientsComponent,
    RecipesComponent,
    AllergiesComponent,
    StepsComponent,
    LoaderComponent,
    AllergyComponent,
    AddAllergyComponent,
    EditAllergyComponent,
    EditStepComponent,
    EditRecipeComponent,
    EditUserComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    TokenPasswordComponent,
    AccessDeniedPageComponent,
    EditCreatorProfileComponent,
    CreatorMenuComponent,
    CreatorRecipesComponent,
    CreatorRegistrationComponent,
    ReviewRecipesComponent,
    ReviewDetailComponent,
    CommentComponent,
  ],
  imports: [
    MatExpansionModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
    ImageCropperModule,

    MatProgressBarModule,
    MatInputModule,
    SpeedTestModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule.forRoot({type: 'ball-scale-multiple'})
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [StringsManager,{ provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },AddRecipeComponent,EditRecipeComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
