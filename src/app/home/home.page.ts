import { AppVersion } from '@ionic-native/app-version/ngx';
import { ConfigService } from './../service/config.service';
import { User } from '../interface/user';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './../service/api.service';
import { Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, ModalController } from '@ionic/angular';

import { AdmobFreeService } from '../service/admobfree.service';

import { AnalyticsFirebase } from '@ionic-native/analytics-firebase/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  userInfo: User;
  appv: any;
  dataReturned: any;
  subscription: any;
  loggin_in: number;
  msg: string;
  @ViewChild('myelement') myElem;
  constructor(
    private app: AppVersion,
    private admob: AdmobFreeService,
    private configService: ConfigService,
    private api: ApiService,
    private http: HttpClient,
    private storage: Storage,
    private navCtr: NavController,
    private appVersion: AppVersion,
    private analyticsFirebase: AnalyticsFirebase,
    public modalController: ModalController,
  ){
  }

  data: any;

  ngOnInit() {
    this.analyticsFirebase.setCurrentScreen('Home')
    .then(() => console.log('View successfully tracked'))
    .catch(err => console.log('Error tracking view:', err));
    // this.configService.log_event('page_view', 'Home Page');
    this.admob.InterstitialAd();
    this.storage.ready().then(()=>{
      this.storage.get('user').then((val: User)=>{
        if(val){
          // alert("User Logged In");
          this.userInfo = val;
          // Set user id
          this.analyticsFirebase.setUserId(this.userInfo.user_id)
          .then(() => console.log('User id successfully set'))
          .catch(err => console.log('Error setting user id:', err));
        }else{
          // alert("No Logged In user");
          this.navCtr.navigateRoot('/login');
        }
      });
    });

    this.appVersion.getVersionNumber().then((appvv:any)=>{
      this.appv = appvv;
    });
    this.admob.BannerAd();
  }


  openPage(url){
    this.configService.openPage(url, 'forward');
  }

  logout(){
    this.storage.remove('user').then(()=>{
      this.navCtr.navigateRoot('/login');
    })
  }


  login(email, password){
    // this.loggin_in = 1;
    this.admob.InterstitialAd();
    // this.configService.loading("Logging In");
    this.subscription = this.api.makeGetRequest('http://toykam.ml/ApiController/login?email='+email+'&pass='+password).subscribe((res: any)=>{
      if(res){
        if(res.status == 1){
          console.log(res);
          // this.authState.next(true);
          this.configService.toast(res.msg, 'success');
          this.storage.set('user', res.detail).then(()=>{
            this.storage.set('user_credit', res.credit).then(()=>{
              this.navCtr.navigateRoot('home');
              // this.authState.next(true);
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
  
}
