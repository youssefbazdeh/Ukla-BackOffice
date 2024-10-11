import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import  jwt_decode, { JwtDecodeOptions,JwtPayload } from 'jwt-decode'; // Import jwt-decode

const TOKEN_HEADER_KEY = 'Authorization';
const REFRESHTOKEN_KEY = 'auth-refreshtoken';
interface DecodedToken {
  exp: number; 
}
@Injectable()
export class Interceptor implements HttpInterceptor {
  
  private isRefreshing = false;
  private isexpired = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor( private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
    let authReq = req;
    const token = window.sessionStorage.getItem("access-token");
    if (token != null) {
      const decodedToken = jwt_decode<DecodedToken>(token);
      
      const currentDate = new Date();
      const expirationDate = new Date(decodedToken.exp * 1000); // Convert to milliseconds
      
      if (currentDate > expirationDate) {
        this.isexpired=true;
      }
      authReq = this.addTokenHeader(req, token);
    }
    return next.handle(authReq).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401 && this.isexpired) {
        return this.handle401Error(authReq, next);
      }

      return throwError(error);
    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = window.sessionStorage.getItem("access-token");
      if (token)
        return this.authService.refreshToken(token).pipe(
          switchMap((newtoken: any) => {
            this.isRefreshing = false;
            window.sessionStorage.removeItem("access-token");
            window.sessionStorage.setItem("access-token", newtoken.access_token);
            this.refreshTokenSubject.next(newtoken.access_token);
            return next.handle(this.addTokenHeader(request, newtoken.access_token));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            
            window.sessionStorage.clear();
            return throwError(err);
          })
        );
    }
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
   return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
  }
}


