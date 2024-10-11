import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../Models/User';
import {map, Observable, tap} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';
import {StringsManager} from "../strings_manager";


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


  ajouterCreator(formData: FormData): Observable<any> {
    const url = `  ${this.stringsManager.host}/ukla/creator/add`;

    return this.http.post<any>(url, formData);
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

  refreshToken(refreshToken: string): Observable<any> {
    const url = `${this.stringsManager.host}/ukla/registration/refreshtoken`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${refreshToken}` 
    });
    return this.http.get<any>(url, { headers: headers }); 
  }

}




