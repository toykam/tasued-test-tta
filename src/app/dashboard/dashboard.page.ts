import { AdmobFreeService } from './../service/admobfree.service';
import { ConfigService } from './../service/config.service';
import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { User } from '../interface/user';
import { ApiService } from '../service/api.service';
import { AnalyticsFirebase } from '@ionic-native/analytics-firebase/ngx';
import { ResultPage } from '../result/result.page';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { PictureSourceType, Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  userInfo: User;
  userCredit: any;
  userScore: any;
  testHistory: any;
  deleting: boolean = false;
  // userCredit: any;
  constructor(
    private analyticsFirebase: AnalyticsFirebase,
    private storage: Storage,
    private conf: ConfigService,
    private api: ApiService,
    private admob: AdmobFreeService,
    public modalController: ModalController,
    private actionSheetController: ActionSheetController,
    public camera: Camera,
  ) { }

  ngOnInit() {
    this.analyticsFirebase.setCurrentScreen('Dashboard')
    .then(() => console.log('View successfully tracked'))
    .catch(err => console.log('Error tracking view:', err));
    // this.conf.log_event('page_view', 'Dashboard');
    this.storage.get('user').then((val: User)=>{
      this.userInfo = val;
      this.storage.get('user_credit').then((val: any)=>{
        this.userCredit = val;
      });
      this.storage.get('user_test_history').then((val: any)=>{
        this.testHistory = val;
      });
    });
    this.admob.RewardVideoAd();
  }

  async openHistory(test){
    // console.log(test.test);
    const modal = await this.modalController.create({
      component: ResultPage,
      componentProps: {
        "questions": JSON.parse(test.test),
        "score": test.score,
        "userInfo": false,
        "course": test.course,
        "page_name": test.course,
      }
    });
 
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
      }
    })
    return modal.present();
  }

  deleteTest(test){
    this.deleting = true;
    // console.log(test.id);
    let data = {"uid": this.userInfo.user_id, "id": test.id};
    let dt = this.api.makePostRequest(this.conf.getApiUrl()+"ApiController/deleteTest", data).subscribe((data: any)=>{
      this.conf.toast("Deleting From History", "primary");
      // console.log(data);
      if(data){
        if(data.status == 1){
          this.storage.ready().then(()=>{
            this.storage.set('user_test_history', data.test_history).then((val: any)=>{
              this.testHistory = val;
              this.deleting = false;
              this.conf.toast(data.msg, "success");
            });
          });
        }else{
          this.conf.toast(data.msg, "danger");
          this.deleting = false;
        }
      }else{
        this.conf.toast("Internet Error Occurred", "danger");
        this.deleting = false;
      }
    });
  }

  change_profile_picture(){
    this.upload_image();
  }

  async upload_image(){
    let actionsheet = await this.actionSheetController.create({
      header: "Select image source",
      buttons: [
        {
          text: 'Select From Storage',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Take a picture',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          },
        },
        {
          text: 'Cancle',
          role: 'cancle',
          handler: () => {

          }
        }
      ]
    });

    return actionsheet.present();
  }

  takePicture(sourceType: PictureSourceType){
    var options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
    }

    this.camera.getPicture(options).then((imagePath)=>{
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var currentPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
    });
  }

  createFileName(){
    return this.userInfo.user_id+'.jpg';
  }
}
