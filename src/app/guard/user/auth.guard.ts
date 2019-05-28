import { User } from './../../interface/user';
import { ConfigService } from './../../service/config.service';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
    isOnline: boolean = false;
    constructor(private router: Router, private storage: Storage, private configService: ConfigService) {

    }

    canActivate(route: ActivatedRouteSnapshot): boolean {

        // console.log(route)

        this.storage.get('user').then((val: User)=>{
          if(val){
            this.isOnline = true;
          }else{
            this.isOnline = false;
          }
        })

        if (!this.isOnline) {
            this.router.navigate(['login']);
            this.configService.toast("Please Login To Continue", "danger");
            return false;
        }

        return true;

    }

}
