import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {map, Observable} from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import {StringsManager} from "../strings_manager";

@Injectable({
  providedIn: 'root',
})
export class GlobalService {

  token:string|null= window.sessionStorage.getItem("access-token");


  constructor(private router: Router, private http: HttpClient,private stringsManager: StringsManager) {}




  generateImageSrc(id:number): Observable<any> {
    const url = `  ${this.stringsManager.host}/ukla/file-system/image/${id}`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = { headers: headers };

    return this.http.get<any>(url,requestOptions).pipe(
      map(response => {
          return response.imageUrl;
      })
    );
  }
  getImage(id:number): Observable<Blob> {
    const url = `  ${this.stringsManager.host}/ukla/file-system/image/${id}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    return this.http.get(url , {
      headers: headers,
      responseType: 'blob'
    });
  }
  getVideo(id:number): Observable<Blob> {
    const url = `  ${this.stringsManager.host}/ukla/file-system-video/video/${id}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    

    return this.http.get(url , {
      headers: headers,
      responseType: 'blob'
    });
  }

  updateSasUrl(url: string): Observable<string> {
    const headers = new HttpHeaders({
       Authorization: `Bearer ${this.token}`,
       'Content-Type': 'application/json'
    });
   
    const body = {
      url: url
  };
    const url_ = `${this.stringsManager.host}/ukla/file-system-video/update-video-url`;
   
    return this.http.put(url_, body, {
       headers: headers,
       responseType: 'text' as 'json' // This is a workaround to bypass TypeScript's type checking
    }).pipe(
      map(response => response as string) // Explicitly cast the response to string
    );
   }

   


  
  logout(){
    const url = `  ${this.stringsManager.host}/ukla/logout`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    const requestOptions = {headers: headers};
    sessionStorage.removeItem('access-token');

    this.router.navigate(['/Login']);
    return this.http.post(url,{},requestOptions);

  }

  

}
