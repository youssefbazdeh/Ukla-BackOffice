import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StringsManager } from '../strings_manager';

@Injectable({
  providedIn: 'root',
})
export class StepService {


  token: string | null = window.sessionStorage.getItem("access-token");
  constructor(private router: Router, private http: HttpClient ,private stringsManager: StringsManager) {}




  editStepVideo(formData:FormData,id:number): Observable<any> {

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = {headers: headers};
    const url = `  ${this.stringsManager.host}/ukla/Recipe/addVideotoStep/${id}`;

    return this.http.put<any>(url, formData ,requestOptions);
  }
  getStep(id: number): Observable<any> {
    const url = `${this.stringsManager.host}/ukla/Recipe/getStepById/${id}`;
    
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
  
    const requestOptions = { headers: headers };
  
  
    return this.http.get<any>(url, requestOptions);
  }
  
  

  
}
