import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../Models/User';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {StringsManager} from "../strings_manager";

@Injectable({
  providedIn: 'root',
})
export class UserService {

  token:string|null= window.sessionStorage.getItem("access-token");


  constructor(private router: Router, private http: HttpClient,private stringsManager: StringsManager) {}



  rechercherParEmail(email: string): Observable<User[]> {
    const url = `  ${this.stringsManager.host}/ukla/user/retrieveByEmail?email=${email}`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers };
    return this.http.get<User[]>(url,requestOptions);
  }
  getUsers(): Observable<User[]> {
    const url = `  ${this.stringsManager.host}/ukla/user/retrieveAll`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers };

    return this.http.get<User[]>(url,requestOptions);
  }
  resendCode(email: string): Observable<any> {
    const url = `  ${this.stringsManager.host}/ukla/registration/resend/${email}`;

    return this.http.post<any>(url, email);
  }
  setRole(role: string,id:number): Observable<any> {
    const url = `  ${this.stringsManager.host}/ukla/user/setRole/${id}/${role}`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers };
    return this.http.post<any>(url,role,requestOptions);
  }
  confirmCode(code: string): Observable<any> {
    const url = `  ${this.stringsManager.host}/ukla/registration/confirm?token=${code}`;

    return this.http.get<any>(url);
  }
  deleteUser(id: number): Observable<any> {
    const url = `  ${this.stringsManager.host}/ukla/user/delete/${id}`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      observe: 'response'
    });
    const requestOptions = { headers: headers };
    return this.http.delete<any>(url,requestOptions);
  }
  forgetPassword(user:User){

    const url = `  ${this.stringsManager.host}/ukla/forgetPassword/forgot_password`;

    return this.http.post<any>(url, user);

  }
  updatePass(user:User){
    const url = `  ${this.stringsManager.host}/ukla/forgetPassword/updatePassword`;
    return this.http.put<any>(url, user);
  }
  getUserByToken(token:String){
    const url = `  ${this.stringsManager.host}/ukla/forgetPassword/getByToken/${token}`;
    return this.http.get<any>(url);


  }
  verifiedToken(token:String){
    const url = `  ${this.stringsManager.host}/ukla/forgetPassword/reset_password?token=${token}`;
    return this.http.post<any>(url,token);


  }
  updateCreatorProfile(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = {headers: headers};
    const url = `  ${this.stringsManager.host}/ukla/creator/update `;

    return this.http.put<any>(url, formData, requestOptions);
  }
  getCreatorByUsername(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = {headers: headers};
    const url = `  ${this.stringsManager.host}/ukla/creator/getByUsername`;
    return this.http.get<any>(url, requestOptions);
  }
  updateImage(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = {headers: headers};
    const url = `  ${this.stringsManager.host}/ukla/creator/updateImage`;
    return this.http.put<any>(url, formData, requestOptions);
  }
}
