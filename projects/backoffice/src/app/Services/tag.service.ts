import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Tags } from '../Models/Tags';
import {StringsManager} from "../strings_manager";

@Injectable({
  providedIn: 'root',
})
export class TagService {

  token:string|null= window.sessionStorage.getItem("access-token");


  constructor(private router: Router, private http: HttpClient,private stringsManager: StringsManager) {}




deleteTag(id:number){
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`
  });
  const requestOptions = { headers: headers };
  const deleteT = `${this.stringsManager.host}/ukla/tag/deleteById/${id}`;
  return this.http.delete<any>(deleteT,requestOptions );


}
  ajouterTag(title:any): Observable<any> {

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers };
    const url = `${this.stringsManager.host}/ukla/tag/add`;

    return this.http.post<any>(url, title,requestOptions );
  }
  updateTag(tag:Tags): Observable<any> {

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers };
    const url = `${this.stringsManager.host}/ukla/tag/add`;

    return this.http.post<any>(url, tag,requestOptions );
  }

}
