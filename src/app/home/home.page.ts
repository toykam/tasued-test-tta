import { AppVersion } from '@ionic-native/app-version/ngx';
import { ConfigService } from './../service/config.service';
import { User } from '../interface/user';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './../service/api.service';
import { Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, ModalController, Platform, LoadingController, AlertController } from '@ionic/angular';

import { AdmobFreeService } from '../service/admobfree.service';

import { AnalyticsFirebase } from '@ionic-native/analytics-firebase/ngx';
import { Observable } from 'rxjs';
// import { Observable } from 'rxjs/Observable';

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
  notifications: any = [];
  notification_count: any = 0;
  shownotification: any;
  
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
    private plt: Platform,
    private loadingController: LoadingController,
    private alertController: AlertController,
  ){
    
  }

  data: any;

  ngOnInit() {
    this.plt.ready().then(()=>{
      this.getBakGroundNotification();
      this.shownotification = false;
      this.admob.InterstitialAd();
      this.storage.ready().then(()=>{
        this.storage.get('user').then((val: User)=>{
          if(val){
            this.userInfo = val;
            this.getNotifications();
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
    });
    
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
    this.subscription = this.api.makeGetRequest(this.configService.getApiUrl()+'ApiController/login?email='+email+'&pass='+password).subscribe((res: any)=>{
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

  notification(){
    if(this.shownotification == false){
      this.shownotification = true;
      this.getNotifications();
    }else{
      this.shownotification = false
    }
  }

  async getNotifications(){
    this.admob.InterstitialAd();
    let loader = await this.loadingController.create({
      message: 'Getting Notifications',
    });
    loader.present();
    this.api.makeGetRequest(this.configService.getApiUrl()+'ApiController/get_notifications/'+this.userInfo.user_id).subscribe((res: any)=>{
      // console.log(res);
      if(res){
        this.storage.ready().then((res: any)=>{
          this.storage.set('notifications', res.notifications).then(()=>{
            loader.dismiss();
          });
        });
        this.notifications = res.notifications;
        this.notification_count = this.notifications.length;
        // console.log(this.notification_count);
        loader.dismiss();
      }else{
        // this.notifications = [];
        this.storage.ready().then((res: any)=>{
          this.storage.get('notifications').then((res:any)=>{
            if(res){
              this.notifications = res;
              this.notification_count = this.notifications.length;
              loader.dismiss();
            }else{
              this.notifications = [];
              this.notification_count = this.notifications.length;
            }
          });
        });
        loader.dismiss();
      }
    },
    error=>{
      loader.dismiss();

    });
  }

  async viewNotification(note){
    // console.log(note);
    let alert = await this.alertController.create({
      header: note.title,
      message: note.message,
      buttons: [
        {
          text: 'Mark as seen',
          handler: () => {
            let loader =  this.loadingController.create({
              message: 'Marking as seen notification',
            }).then((loader)=>{
              loader.present();
              this.api.makeGetRequest(this.configService.getApiUrl()+'ApiController/mark_as_seen/'+note.id).subscribe((res: any)=>{
                // console.log(res);
                this.getNotifications();
              });
              loader.dismiss();
            });
            // 
          }
        },{
          text: 'open',
          handler: () => {
            this.openPage(note.url);
          }
        },
        {
          text: 'Close',
          role: 'cancel',
          handler: ()=>{

          }
        }
      ]
    });
    alert.present();
  }

  getBakGroundNotification(){
    setInterval(()=>{
      this.api.makeGetRequest(this.configService.getApiUrl()+'ApiController/get_notifications/'+this.userInfo.user_id).subscribe((res: any)=>{
        // console.log(res);
        if(res.notifications){
          // console.log('there is notification');          
          this.storage.ready().then((res: any)=>{
            this.storage.set('notifications', res.notifications).then(()=>{
            });
          });
          this.notifications = res.notifications;
          this.notification_count = this.notifications.length;
          // console.log(this.notification_count);
          res.notifications.forEach((val)=>{
            this.configService.notify(val.id, val.title, val.message);
          })
        }
      });   
    }, 10000);
  }
  
}
