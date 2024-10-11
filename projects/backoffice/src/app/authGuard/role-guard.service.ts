import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/auth.service';
import jwtDecode, { JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate{
  constructor(private authService:AuthService,private route: ActivatedRoute,private router:Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const expectedRole = route.data['expectedRole'];

    
    if(this.getRoleFromSessionStorage!= undefined){
      const expected=expectedRole.includes(this.getRoleFromSessionStorage());
      if (expected) {
  
        return true;
      } else {
        this.router.navigate(['/AccessDenied']); // Redirect to login if the user does not have the expected role
        return false;
      }
    }
    return true;
 }

  getRoleFromSessionStorage(): string | string[] | null | undefined {
  const token = window.sessionStorage.getItem("access-token");
  if (token) {
    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      if (decodedToken.role!=undefined){
        return decodedToken.role[0];
      }
        
      return decodedToken.role;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  return null;
}
  
}
