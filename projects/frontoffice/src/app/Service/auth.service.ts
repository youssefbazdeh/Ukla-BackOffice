import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StringsManager } from '../../../../backoffice/src/app/strings_manager';
import { Observable } from 'rxjs';
import { User } from '../Models/User';


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  users!: User[];


  public loggedUser!: string;
  public isloggedIn: Boolean = false;
  public role!: string;
  private item!: string | null;

  private isLoggedIn = false;
  private helper = new JwtHelperService();


  token!: string;


  constructor(private router: Router,
              private http: HttpClient, private stringsManager: StringsManager) {
  }


  ajouterUser(user: User): Observable<any> {
    const url = `  ${this.stringsManager.host}/ukla/registration/user`;

    return this.http.post<any>(url, user);
  }


  isLogin() {
    this.isLoggedIn = true;
  }


  isLogout() {
    this.isLoggedIn = false;
  }


  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }


  login(username: any, password: any) {
    const url = `  ${this.stringsManager.host}/ukla/login`;
    let body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = {headers: headers};
    return this.http.post<any>(url, body, options)
  }

  LoginTests(user:User) {

    const url = `  ${this.stringsManager.host}/ukla/registration/LoginTest`;

    return this.http.post<any>(url, user)
  }

  decodeJWT(token: any) {
    if (token == undefined)
      return;
    const decodedToken = this.helper.decodeToken(token);
    this.role = decodedToken.role;
    this.loggedUser = decodedToken.sub;
  }

  getToken(): string | null {
    return sessionStorage.getItem('access-token');
  }

}
