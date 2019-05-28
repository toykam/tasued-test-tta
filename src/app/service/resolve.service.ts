import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
// import { map } from 'rxjs/operators/map';

@Injectable({
  providedIn: 'root'
})
export class ResolveService implements Resolve<any>{

  constructor(private http: HttpClient) { }

  resolve(route: ActivatedRouteSnapshot){
    return this.http.get('https://tasuedtest.000webhostapp.com/ApiController/getChallenges');
  }
}
