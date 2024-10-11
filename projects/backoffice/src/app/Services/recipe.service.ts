import {StringsManager} from '../strings_manager';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, map, switchMap} from 'rxjs';
import {HttpClient, HttpEvent, HttpEventType, HttpHeaderResponse, HttpHeaders, HttpRequest, HttpResponse} from '@angular/common/http';
import { SpeedTestService } from 'ng-speed-test';


@Injectable({
  providedIn: 'root',
})
export class RecipeService {

  token: string | null = window.sessionStorage.getItem("access-token");

  constructor(private router: Router, private http: HttpClient, private stringsManager: StringsManager,private speedTestService:SpeedTestService) {
  }



  getIngridientsNames(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = {headers: headers};
    const url = `  ${this.stringsManager.host}/ukla/ingredient/retrieveAll/1/10`;
    return this.http.get<any>(url, requestOptions);
  }

  getTags(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = {headers: headers};
    const url = `  ${this.stringsManager.host}/ukla/tag/getAllT`;
    return this.http.get<any>(url, requestOptions);
  }

  getRecipes(pageN:number,itemN:number): Observable<any> {
    const url = `  ${this.stringsManager.host}/ukla/Recipe/retrieveAll/${pageN}/${itemN}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    const requestOptions = {headers: headers};
    return this.http.get<any>(url,requestOptions);
  }
  getCreatorRecipesByUsername(pageN:number,itemN:number): Observable<any> {
    const url = `  ${this.stringsManager.host}/ukla/Recipe/retrieveAllCreatorRecipes/${pageN}/${itemN}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    const requestOptions = {headers: headers};
    return this.http.get<any>(url,requestOptions);
  }
  
  getReviewsWithPagination(pageN:number,itemN:number,status:any): Observable<any> {
    const url = `  ${this.stringsManager.host}/ukla/Recipe/getReviews/${pageN}/${itemN}/${status}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    const requestOptions = {headers: headers};
    return this.http.get<any>(url,requestOptions);
  }

  
  getReviewsById(id: number): Observable<any> {
    const url = `  ${this.stringsManager.host}/ukla/Recipe/getReviewById/${id}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    const requestOptions = {headers: headers};
    return this.http.get<any>(url,requestOptions);
  }

  
  updateReview(id:number, formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = {headers: headers};
    const url = `  ${this.stringsManager.host}/ukla/Recipe/updateReview/${id} `;

    return this.http.put<any>(url, formData, requestOptions);
  }
  
  getRecipesCount(): Observable<any> {
    const url = `  ${this.stringsManager.host}/ukla/Recipe/count`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    const requestOptions = {headers: headers};
    return this.http.get<any>(url,requestOptions);
  }
  getCreatorRecipesCount(): Observable<any> {
    const url = `  ${this.stringsManager.host}/ukla/Recipe/countCreatorRecipes`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    const requestOptions = {headers: headers};
    return this.http.get<any>(url,requestOptions);
  }

  getReviewsCount(status:any): Observable<any> {
    const url = `  ${this.stringsManager.host}/ukla/Recipe/countReview/${status}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    const requestOptions = {headers: headers};
    return this.http.get<any>(url,requestOptions);
  }
  getRecipeById(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = {headers: headers};
    const url = `  ${this.stringsManager.host}/ukla/Recipe/getById/${id}`;
    return this.http.get<any>(url, requestOptions);
  }
  getRecipeByName(name: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = {headers: headers};
    const url = `  ${this.stringsManager.host}/ukla/Recipe/retrieveByName/${name}`;
    return this.http.get<any>(url, requestOptions);
  }
  getReviewByRecipeID(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = {headers: headers};
    const url = `  ${this.stringsManager.host}/ukla/Recipe/getReviewByRecipeID/${id}`;
    return this.http.get<any>(url, requestOptions);
  }
deleteStep(idRecipe:number,idStep:number){
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`
  });
  const requestOptions = {headers: headers};
  const deleteR = `${this.stringsManager.host}/ukla/Recipe/deleteStep/${idRecipe}/${idStep}`;
  return this.http.delete<any>(deleteR, requestOptions);

}
  updateRecipe(formData: FormData,id:number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = {headers: headers,
      reportProgress: true,
    };
    const url = `  ${this.stringsManager.host}/ukla/Recipe/update/${id} `;
    const req = new HttpRequest('PUT', url, formData, requestOptions);
    const startTime = Date.now();
    return this.getDebit().pipe(
      switchMap(debit => {
        return this.http.request(req).pipe(
          map(event => {
            let response: any;
            let { progress, elapsedTime, remainingTime } = this.calculateUploadMetrics(event, startTime, debit);
            let minutes = Math.round(remainingTime / 60);
  
            if (event.type === HttpEventType.Response) {
              response = event.body;
            }
  
            return { type: event.type === HttpEventType.UploadProgress ? 'progress' : 'response', progress, minutes, response };
          })
        );
      })
   );
  }
  updateImage(formData: FormData,id:number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = {headers: headers};
    const url = `  ${this.stringsManager.host}/ukla/Recipe/updateImage/${id}`;
console.log(url)
    return this.http.put<any>(url, formData, requestOptions);
  }
  updateVideo(formData: FormData,id:number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = {headers: headers};
    const url = `  ${this.stringsManager.host}/ukla/Recipe/updateVideo/${id}`;

    return this.http.put<any>(url, formData, requestOptions,);
  }
  ajouterRecipe(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
       Authorization: `Bearer ${this.token}`
    });
    const requestOptions = {
       headers: headers,
       reportProgress: true,
    };
    const url = `${this.stringsManager.host}/ukla/Recipe/addv2`;
    const req = new HttpRequest('POST', url, formData, requestOptions);
    const startTime = Date.now();
   
    return this.getDebit().pipe(
       switchMap(debit => {
         return this.http.request(req).pipe(
           map(event => {
             let response: any;
             let { progress, elapsedTime, remainingTime } = this.calculateUploadMetrics(event, startTime, debit);
             let minutes = Math.round(remainingTime / 60);
   
             if (event.type === HttpEventType.Response) {
               response = event.body;
             }
   
             return { type: event.type === HttpEventType.UploadProgress ? 'progress' : 'response', progress, minutes, response };
           })
         );
       })
    );
   }
  calculateUploadMetrics(event: HttpEvent<any>, startTime: number, debit: number): { progress: number, elapsedTime: number, remainingTime: number } {
    let progress = 0;
    let elapsedTime = 0;
    let remainingTime = 0;
   
    if (event.type === HttpEventType.UploadProgress && event.total) {
       // Calculate the progress percentage
       progress = Math.round(100 * event.loaded / event.total);
       // Calculate the time elapsed
       elapsedTime = Date.now() - startTime;

       const totalTime = (event.total / 1024 / 1024) / (debit / 8); // Convert debit to Mbps and file size to MB

       remainingTime = Math.round(totalTime * (1 - progress / 100) - elapsedTime / 1000); // Convert elapsedTime to seconds
       // Ensure remainingTime is not negative
       remainingTime = Math.max(0, remainingTime);
    }
   
    return { progress, elapsedTime, remainingTime };
   }
   
  getDebit(): Observable<number> {
    return this.speedTestService.getMbps();
   }

  deleteRecipe(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = {headers: headers};
    const deleteR = `${this.stringsManager.host}/ukla/Recipe/delete/${id}`;
    return this.http.delete<any>(deleteR, requestOptions);
  }

  setReviewInreviewStatus(id:number, formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = {headers: headers};
    const url = `  ${this.stringsManager.host}/ukla/Recipe/setReviewInreviewStatus/${id} `;

    return this.http.put<any>(url, formData, requestOptions);
  }
  
  forceDeleteRecipe(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = {headers: headers};
    const deleteR = `${this.stringsManager.host}/ukla/Recipe/forceDeleteRecipe/${id}`;
    return this.http.delete<any>(deleteR, requestOptions);
  }
}
