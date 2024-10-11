import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StringsManager } from '../../../../backoffice/src/app/strings_manager';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../Models/User';


@Injectable({
  providedIn: 'root'
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
  deleteAccountByUsername(): Observable<any>{
    const url = `${this.stringsManager.host}/ukla/user/deleteAccountByUsername`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers,
      responseType: 'text' as 'json'
     };
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
  
}
