import { User } from './../interface/user';
import { Injectable } from '@angular/core';
import { NavController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ApiService } from './api.service';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
// import { AppCenterAnalytics } from '@ionic-native/app-center-analytics/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'; 

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  userInfo: User;
  load: HTMLIonLoadingElement;
  apiUrl: any = "http://toykam.ml/";
  constructor(
    private api: ApiService,
    private storage: Storage,
    private navController: NavController,
    private loader: LoadingController,
    private toastController: ToastController,
    private firebaseAnalytics: FirebaseAnalytics,
    private localNotifications: LocalNotifications,
    private plt: Platform,
    // private appCenterAnalytics: AppCenterAnalytics,
  ) {
    this.plt.ready().then((rdy)=>{
      this.localNotifications.on('click').subscribe((res)=>{
        
      })
    });
  }

  getApiUrl(){
    return this.apiUrl;
  }
  openPage(url: string, dir: string){
    if(dir == 'forward'){
      this.navController.navigateForward(url)
    }else{
      this.navController.pop();
    }
  }

 async loading(content){
    let load = await this.loader.create({
      message: content,
      duration: 1000,
    })
    return load.present();
  }

  async toast(msg, color){
    let toaster = await this.toastController.create({
      message: msg,
      duration: 1000,
      cssClass: color,
      position: 'top',
    })
    return await toaster.present();
  }

  async getUserInfo(){
    this.storage.get('user').then((val: User)=>{
      return val;
    })
  }

  async navigateToRoot(url){
    this.navController.navigateRoot(url);
  }

  async getAppVersion(){
    return this.api.makeGetRequest("https://tasuedtest.000webhostapp.com/ApiContoller/getAppVersion");
  }

  log_event(event, page_name){
    this.firebaseAnalytics.logEvent("page_view", {page: page_name})
    .then((res: any) => console.log(res))
    .catch((error: any) => console.error(error));
  }

  notify(id, title, message){
    this.localNotifications.schedule({
      id: id,
      title: title,
      text: message,
      sound:  'file://sound.mp3',
      icon: '/assets/images/icon.png',
      data: { secret: message }
    });
    
    
    // Schedule multiple notifications
    // this.localNotifications.schedule([{
    //    id: 1,
    //    text: 'Multi ILocalNotification 1',
    //    sound: 'file://sound.mp3',
    //    data: { secret:'key' }
    //   },{
    //    id: 2,
    //    title: 'Local ILocalNotification Example',
    //    text: 'Multi ILocalNotification 2',
    //    icon: 'http://example.com/icon.png'
    // }]);
    
    
    // Schedule delayed notification
    // this.localNotifications.schedule({
    //    text: 'Delayed ILocalNotification',
    //    trigger: {at: new Date(new Date().getTime() + 3600)},
    //    led: 'FF0000',
    //    sound: null
    // });
  }

}
