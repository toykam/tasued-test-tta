import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Resolve } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ApiService implements Resolve<any>{
  resolve(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot) {
    throw new Error("Method not implemented.");
  }

  constructor(private http: HttpClient) {}

  makeGetRequest(url){
   return this.http.get(url);
  }

  makePostRequest(url, data){
    // console.log(JSON.stringify(data));
    let header: any = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(url, JSON.stringify(data), header);
  }
}
