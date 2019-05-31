import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, NavController, AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from '../service/api.service';
import { ConfigService } from '../service/config.service';
import { AdmobFreeService } from '../service/admobfree.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {
  msg: any;
  loading: any;

  timer: any;
  course: string;
  course_id: any;
  questions: any;
  result: any = {};
  q_n: number;
  question: Observable <any>;
  option1: Observable <any>;
  option2: Observable <any>;
  option3: Observable <any>;
  option4: Observable <any>;
  your_score: number = 0;
  time: number;
  timeup: boolean = false;
  hidevalue: boolean;
  subscribtion: any;
  userInfo: any;
  dataReturned: any;
  challenge: any;
  you: any;
  opponent_score: any;
  constructor(
    private modalController: ModalController,
    private storage: Storage,
    private navParams: NavParams,
    private api: ApiService,
    private conf: ConfigService,
    private admob: AdmobFreeService,
    private navCtr: NavController,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.storage.ready().then(()=>{
      this.storage.get('user').then((res: any)=>{
        this.userInfo = res;
        // console.log(this.userInfo);
        this.q_n = 0;
        // console.log(this.navParams.data.challenge);
        this.challenge = this.navParams.data.challenge;
        this.questions = JSON.parse(this.challenge.questions);
        // this.opponenet_score = this.
        if(this.challenge.challenged_id == this.userInfo.user_id){
          this.opponent_score = this.challenge.challenged_score;
        }else{
          this.opponent_score = this.challenge.challenger_score;
        }
        this.time = this.questions.length * 10;
        this.showQuestion();
        this.StartTimer();
      })
    })
      
  }

  checkAnswer(answer){
    if(this.timeup){
      this.conf.toast("Time Up", "danger");
    }else{
      if(answer == this.questions[this.q_n].answer){// Check if answer is correct
        this.your_score += 1;
      }
      setTimeout(()=>{
        this.nextQ();
      }, 1000);
    }
  }

  StartTimer(){
    this.timer = setTimeout(() => 
      {
          if(this.time <= 0) {
            this.timeup = true;
          }
          this.time -= 1;

          if(this.time>0){
            this.hidevalue = false;
            this.StartTimer();
          }
          
          else{
            this.timeup = true;
            this.hidevalue = true;
          }

          if(this.timeup){
            // this.openModal();
            this.finish_challenge();
          }

      }, 1000);
  }

  prevQ(){
    if((this.q_n) == 0){
      console.log(this.q_n);
      this.conf.toast("First Question Reached", "danger");
    }else{
      this.q_n -= 1;
      this.showQuestion();
    }
  }
  showQuestion() {
    this.question = this.questions[this.q_n].question;
    this.option1 = this.questions[this.q_n].option1;
    this.option2 = this.questions[this.q_n].option2;
    this.option3 = this.questions[this.q_n].option3;
    this.option4 = this.questions[this.q_n].option4;
  }
  nextQ(){
    if((this.q_n + 1) == this.questions.length){
      console.log(this.q_n);
      this.conf.toast("Last Question Reached", "danger");
    }else{
      this.q_n += 1;
      this.showQuestion();
    }
  }

  openPage(url){
    this.navCtr.navigateRoot(url);
  }

  async complete_challenge(){
    let alert = await this.alertController.create({
      header: 'Confirm',
      message: 'Are you sure you want to complete this challenge',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.time = 0;
            this.finish_challenge();
          }
        },
        {
          text: 'No',
          role: 'cancel',
          handler: ()=>{

          }
        }
      ]
    });
    alert.present();
  }

  async finish_challenge(){
    let alert = await this.loadingController.create({
      message: 'Finalizing Challenge',
    });
    alert.present();
    let cc = this.api.makePostRequest(this.conf.getApiUrl()+'ApiController/complete_challenge', 
    {'uid':this.userInfo.user_id, 'score':this.your_score, 'cid':this.challenge.challenge_id}).subscribe((res: any)=>{
      console.log(res);
      alert.dismiss();
    });
  }

}
