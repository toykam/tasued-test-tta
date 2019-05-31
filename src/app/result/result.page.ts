import { AdmobFreeService } from './../service/admobfree.service';
import { ModalController, NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { ConfigService } from '../service/config.service';


@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {
  questions: any;
  score: any;
  grade: any;
  userInfo: any;
  scoreSaved: boolean = false;
  timeCredit: number;
  course: string;
  uploadingScore: boolean;
  page_name: any;
  constructor(
    private modalController: ModalController,
    private storage: Storage,
    private navParams: NavParams,
    private api: ApiService,
    private conf: ConfigService,
    private admob: AdmobFreeService,
  ) { }

  ngOnInit() {
    this.admob.RewardVideoAd();
    this.scoreSaved = false;
    // console.table(this.navParams);
    this.questions = this.navParams.data.questions;
    this.score = this.navParams.data.score;
    this.userInfo = this.navParams.data.userInfo;
    this.timeCredit = this.navParams.data.timeCredit;
    this.course = this.navParams.data.course;
    this.page_name = this.navParams.data.page_name;
    this.grade = ((this.score/this.questions.length) * 100);
    if(this.userInfo){
      this.uploadingScore = true;
      this.conf.toast("we are adding this test to your test history", "primary");
      let data:any = {'test': JSON.stringify(this.questions), 'course':this.course, 'score': this.score};
      let savet = this.api.makePostRequest(this.conf.getApiUrl()+"ApiController/saveTest/"+this.userInfo.user_id, data).subscribe((data: any)=>{
        if(data){
          console.log(data);
          if(data.status == 1){
            this.storage.ready().then(()=>{
              this.storage.set('user_test_history', data.test_history).then(()=>{
                this.uploadingScore = false;
                this.conf.toast("This test have been added to your test history", "primary");
              });
            });
          }else{
            this.uploadingScore = false;
            this.conf.toast("Unable to add this test to your history", "danger");
          }
        }
      },
      error => {
        this.uploadingScore = false;
        this.conf.toast("Internet Error Occurred!", "danger");
      });
    }
    
  }

  saveScore(){
    // var data = "?course="+this.course+"&test"+JSON.stringify(this.questions);
    if(this.grade >= 80){
      if(this.scoreSaved){
        this.conf.toast("You already saved this score", "danger");
      }else{
        let sub = this.api.makeGetRequest(this.conf.getApiUrl()+"ApiController/addToCredit/"+this.userInfo.user_id+"/"+(5+this.timeCredit)).subscribe((res:any) => {
          if(res){
            if(res.status == 1){
              this.storage.set('user_credit', res.usercredit).then(()=>{
                this.conf.toast(res.msg, 'success');
                this.scoreSaved = true;
              });
              // console.log(this.scoreSaved);
              sub.unsubscribe();
            }else{
              this.conf.toast(res.msg, 'danger');
              sub.unsubscribe();
            }
          }
        });
      }
    }else{
      this.scoreSaved = true;
      this.conf.toast("You have to score above 80%", "danger");
    }
  }

  async closeModal() {
    // const onClosedData: string = "Wrapped Up!";
    this.admob.InterstitialAd();
    await this.modalController.dismiss();
  }

}
