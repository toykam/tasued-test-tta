import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../service/config.service';
import { ApiService } from '../service/api.service';
import { Response } from '../interface/response';
import { NavController, LoadingController } from '@ionic/angular';
import { AdmobFreeService } from '../service/admobfree.service';
import { promise } from 'protractor';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  email: any;
  password: any;
  res: Response;
  subscription;

  loggin_in: any;
  msg: string = "";

  constructor(
    private loadingController: LoadingController,
    private configService: ConfigService,
    private api: ApiService,
    private storage: Storage,
    private navCtr: NavController,
    private admob: AdmobFreeService) { }

  ngOnInit() {
    this.loggin_in = 0;
    // this.configService.log_event('page_view', 'Login Page');
  }

  login(){
    this.loggin_in = 1;
    this.admob.InterstitialAd();
    // this.configService.loading("Logging In");
    this.subscription = this.api.makeGetRequest('http://toykam.ml/ApiController/login?email='+this.email+'&pass='+this.password).subscribe((res: any)=>{
      console.log(res);
      if(res){
        if(res.status == 1){
          console.log(res);
          // this.authState.next(true);
          this.configService.toast(res.msg, 'success');
          this.storage.set('user', res.detail).then(()=>{
            this.storage.set('user_credit', res.credit).then(()=>{
              this.storage.set('user_test_history', res.test_history).then(()=>{
                this.navCtr.navigateRoot('home');
                // this.authState.next(true);
              });
            });
          });        
        this.loggin_in = 0;
        }else{
          this.loggin_in = 0;
          this.msg = res.msg;
          this.configService.toast(res.msg, 'danger');
          this.ngOnInit();
        }
      }else{
        this.loggin_in = 0;
        this.msg = "Server Error Please restart the app";
        this.configService.toast("Internet Error ", "danger");
      }
    }),
    error => {
      this.loggin_in = 0;
      this.msg = "Please restart the app with internet connection";
      this.configService.toast("Internet Error ", "danger");
      this.ngOnInit();
    }
  }

  ionViewWillLeave(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
}
