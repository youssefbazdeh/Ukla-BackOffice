import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StringsManager } from '../strings_manager';
import {Allergy} from "../Models/Allergy";

@Injectable({
  providedIn: 'root',
})
export class AllergyService {



  token:string|null= window.sessionStorage.getItem("access-token");







  constructor(private router: Router, private http: HttpClient ,private stringsManager: StringsManager) {}





  addAllergy(formData:FormData): Observable<any> {
    const url = `  ${this.stringsManager.host}/ukla/Allergies/add`;
    console.log(this.token);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers };


    return this.http.post<any>(url, formData,requestOptions );
  }
  updateAllergy(allergy:FormData): Observable<any> {
    const url = `  ${this.stringsManager.host}/ukla/Allergies/update`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers };



    return this.http.put<any>(url, allergy ,requestOptions);
  }
  updateImage(formData:FormData,id:number): Observable<any> {
    const url = `  ${this.stringsManager.host}/ukla/Allergies/updateImage/${id}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers };



    return this.http.put<any>(url, formData ,requestOptions);
  }
  getAllergies(){
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers };
    const url = `  ${this.stringsManager.host}/ukla/Allergies/All`;



    return this.http.get<any>(url,requestOptions);

  }
  getAllergyById(id:number){
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers };
    const url = `  ${this.stringsManager.host}/ukla/Allergies/getById/${id}`;



    return this.http.get<any>(url,requestOptions);

  }
  deleteAllergy(id:number): Observable<any> {
    const url = `  ${this.stringsManager.host}/ukla/Allergies/delete/${id}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers };


    return this.http.delete<any>(url ,requestOptions);
  }
}
