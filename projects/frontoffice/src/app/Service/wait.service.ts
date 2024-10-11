import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {wait} from "../Models/wait";
import {StringsManager} from "projects/backoffice/src/app/strings_manager"


@Injectable({
  providedIn: 'root',
})
export class WaitService {
  


  constructor(private router: Router, private http: HttpClient,private stringsManager : StringsManager) {}


  
  addSubscriber(waiter: wait): Observable<any>{
    const url = `${this.stringsManager.host}/ukla/wait/add`;

    return this.http.post<any>(url, waiter);


  }
}
