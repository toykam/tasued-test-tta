import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { Platform, NavController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AdmobFreeService } from './service/admobfree.service';
import { Storage } from '@ionic/storage';
import { ApiService } from './service/api.service';
import { User } from './interface/user';
import { platform } from 'os';
import { ConfigService } from './service/config.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  appv: any;
  loading: any;
  showsplash: boolean = true;
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Leader Board',
      url: '/scoreboard',
      icon: 'podium'
    },
    // {
    //   title: 'Help',
    //   url: '/',
    //   icon: 'help'
    // },
    {
      title: 'Feedback',
      url: '/',
      icon: 'text'
    },
    {
      title: 'Exit',
      url: '/',
      icon: 'exit',
      click: "exitApp"
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private admob: AdmobFreeService,
    // private admob: Admob,
    private app: AppVersion,
    private api: ApiService,
    private navCtr: NavController,
    private alertCtr: AlertController,
    private conf: ConfigService,
  ) {
    this.showsplash = true;
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // let status bar overlay webview
      this.statusBar.overlaysWebView(false);

      // set status bar to white
      this.statusBar.backgroundColorByHexString('brown');
      

      // this.admob.InterstitialAd();
      this.app.getVersionNumber().then((v) => {
        // alert(v);
        this.appv = v;
        this.api.makeGetRequest(this.conf.getApiUrl()+"ApiController/getAppVersion").subscribe((apiv: any) => {
          if(parseFloat(v) < parseFloat(apiv.version) && apiv.required == 1){
            window.open("http://toykam.ml/download#latest");
          }else{
            if(parseFloat(v) < parseFloat(apiv.version) && apiv.required != 1){
              this.alertCtr.create({
                header: 'Notice',
                subHeader: 'Update Notice',
                message: "This Version is Out-dated. Do you want to update?",
                cssClass: 'secondary',
                buttons: [
                  {
                    text: 'Yes',
                    cssClass: 'primary',
                    handler: () => {
                      window.open("http://toykam.ml/download#latest");
                    }
                  },
                  {
                    text: 'No',
                    cssClass: 'danger',
                    role: 'cancel',
                    handler: () => {

                    }
                  }
                ]
              }).then((alert)=>{
                alert.present();
              })
            }else{
            }
          }
          
        });
      });

      this.storage.ready().then(()=>{
        this.storage.get('first').then((val: boolean)=>{
          if(val){
            this.storage.get('user').then((val: User)=>{
              if(val){
                this.navCtr.navigateRoot('/home');
              }else{
                this.navCtr.navigateRoot('/login');
              }
            });
          }else{
            this.storage.set('first', true).then(()=>{
              this.navCtr.navigateRoot('/help');
            });
          }
        });
        
      });
      this.splashScreen.hide();
      setTimeout(() => {
        this.showsplash = false;
      }, 10000);
      
    });
  }

callBack(title){
  if(title == 'Exit'){
    this.exitApp();
  }
  if(title == "Feedback"){
    this.sendFeedBack();
  }
}

exitApp() {
    // alert("Hello i want exit");
    this.alertCtr.create({
      header: "Message",
      message: "Do you want to exit the app",
      buttons: [
        {
          text: "Yes",
          handler: () => {
            // console.log("i am exiting the App");
            navigator['app'].exitApp();
          }
        },
        {
          text: "No",
          role: "cancel",
          handler: () => {
            
          }
        }
      ]
    }).then((alert)=>{
      alert.present();
    });
  }

  sendFeedBack(){
    this.alertCtr.create({
      header: 'Feedback!',
      inputs: [
        {
          name: 'name',
          type: 'text',
          id: 'name',
          placeholder: 'Your name'
        },
        {
          name: 'appv',
          type: 'text',
          value: this.appv,
          id: 'appv',
          placeholder: 'App Version'
        },
        {
          name: 'message',
          type: 'text',
          id: 'message',
          placeholder: 'Your feedback'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Send Feedback',
          handler: (data) => {
            // console.log('Confirm Ok', data);
            let sub = this.api.makeGetRequest(this.conf.getApiUrl()+"ApiController/sendFeed?sender_name="+data.name+"&message="+data.message+"&version="+data.appv).subscribe((res: any) => {
              this.conf.toast("Sending your feedback", "primary");
              this.loading = 1;
              if(res){
                if(res.status == 1){
                  this.conf.toast(res.msg, 'success');
                }else{
                  this.conf.toast(res.msg, 'danger');
                }
                this.loading = 0;
                sub.unsubscribe();
              }
            },
            error => {
              this.conf.toast("Internet error occured while sending feedback, please try again later", 'danger');
              this.loading = 0;
              sub.unsubscribe();
            });
          }
        }
      ]
    }).then(alert => {
      alert.present();
    })
  }
}
