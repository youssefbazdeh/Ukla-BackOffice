import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StringsManager} from "../strings_manager";

@Injectable({
  providedIn: 'root',
})
export class IngredientService {

  token: string | null = window.sessionStorage.getItem("access-token");

  constructor(private router: Router, private http: HttpClient, private stringsManager: StringsManager) {
  }
  getAllIngredients(pageN:number,itemN:number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = {headers: headers};
    const url = `  ${this.stringsManager.host}/ukla/ingredient/retrieveAll/${pageN}/${itemN}`;
    return this.http.get<any>(url, requestOptions);
  }
  searchIngredient(query:string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = {headers: headers};
    const url = `  ${this.stringsManager.host}/ukla/ingredient/searchIngredientByQuery?query=${query}`;
    return this.http.get<any>(url, requestOptions);
  }

  updateImage(formData: FormData,id:number): Observable<any> {

    const url = `  ${this.stringsManager.host}/ukla/ingredient/updateimage/${id}`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = {headers: headers};
    return this.http.put<any>(url, formData, requestOptions);
  }
  getIngredientsCount(): Observable<any> {
    const url = `  ${this.stringsManager.host}/ukla/ingredient/count`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    const requestOptions = {headers: headers};
    return this.http.get<any>(url,requestOptions);
  }
  updateIngredient(formData: FormData): Observable<any> {

    const url = `  ${this.stringsManager.host}/ukla/ingredient/update`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = {headers: headers};
    return this.http.put<any>(url, formData, requestOptions);
  }
  ajouterIngredient(formData: FormData): Observable<any> {

    const url = `  ${this.stringsManager.host}/ukla/ingredient/add`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = {headers: headers};
    return this.http.post<any>(url, formData, requestOptions);
  }

  getById(id: number) {
    const url = `  ${this.stringsManager.host}/ukla/ingredient/getById/${id}`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = {headers: headers};
    return this.http.get<any>(url, requestOptions);
  }
  deleteIngredient(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = {headers: headers};
    const deleteR = `${this.stringsManager.host}/ukla/ingredient/delete/${id}`;
    return this.http.delete<any>(deleteR, requestOptions);
  }
}
