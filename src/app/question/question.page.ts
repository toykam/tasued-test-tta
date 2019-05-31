import { Observable } from 'rxjs';
import { ConfigService } from './../service/config.service';
import { ApiService } from './../service/api.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { AdmobFreeService } from '../service/admobfree.service';
import { Storage } from '@ionic/storage';
import { ResultPage } from '../result/result.page';
import { Vibration } from '@ionic-native/vibration/ngx';

@Component({
  selector: 'app-question',
  templateUrl: './question.page.html',
  styleUrls: ['./question.page.scss'],
})
export class QuestionPage implements OnInit {
  msg: any;
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
  score: number = 0;
  time: number;
  timeup: boolean = false;
  hidevalue: boolean;
  subscribtion: any;
  loading: any;
  userInfo: any;
  dataReturned: any;
  timeCredit: number;
  answered: number;
  constructor(
    private admob: AdmobFreeService, 
    private route: ActivatedRoute, 
    private api: ApiService, 
    private configService: ConfigService, 
    private navCtr: NavController,
    private alertController: AlertController,
    private storage: Storage,
    public modalController: ModalController,
    private vibration: Vibration,
    ) { }

  ngOnInit() {
    this.answered = 0;
    this.timeCredit = 0;
    this.storage.ready().then(()=>{
      this.storage.get('user').then((res)=>{
        this.userInfo = res;
      })
    })
    this.loading = 1;
    // this.configService.log_event('page_view', 'Question Page');
    this.time = 0;
    this.course = this.route.snapshot.paramMap.get('name');
    this.course_id = this.route.snapshot.paramMap.get('id');
    
    this.subscribtion = this.api.makeGetRequest(this.configService.getApiUrl()+'course/question/'+this.course_id).subscribe((res: any)=>{
      // this.configService.loading("Getting questions from server");
      this.msg = "Loading Questions ...";
      if(res.length !== 0){
        this.q_n = 0;
        this.questions = res;
        this.time = (this.questions.length * 15);
        this.score = 0;
        this.timeup = false;
        this.showQuestion();
        // console.log(res);
        this.admob.InterstitialAd();
        this.StartTimer();
        this.msg = '';
        this.loading = 0;
      }else{
        // this.configService.toast("No question for this course please try again", "danger");
        this.msg = 'No Question For This Course';
        this.alertController.create({
          header: 'Message',
          message: 'No Question For This Course',
          cssClass: 'secondary',
          buttons: [
            {
              text: 'Select Another Level',
              cssClass: 'primary',
              handler: () => {
                this.navCtr.navigateBack('/level');
              }
            },
            {
              text: 'Select Another Course',
              cssClass: 'primary',
              handler: () => {
                this.selectAnotherCourse();
              }
            },
            {
              text: 'Go Home',
              cssClass: 'success',
              handler: () => {
                this.navCtr.navigateRoot('home');
              }
            }
          ]
        }).then((alert)=>{
          alert.present();
        });
      }
      this.loading = 0;
    },
    error => {
      this.admob.InterstitialAd();
      this.configService.toast("Internet Connection Error! Please try again", 'danger');
      this.navCtr.navigateRoot('home');
    });

  }

  gohome(){
    this.admob.InterstitialAd();
    this.admob.RewardVideoAd();
    this.configService.navigateToRoot('/home');
  }

  

  showQuestion(){
    this.question = this.questions[this.q_n].question;
    this.option1 = this.questions[this.q_n].option1;
    this.option2 = this.questions[this.q_n].option2;
    this.option3 = this.questions[this.q_n].option3;
    this.option4 = this.questions[this.q_n].option4;
  }

  checkAnswer(answer){
    this.questions[this.q_n].ua = answer;
    if(this.timeup){
      this.configService.toast("Time Up", "danger");
    }else{
      if(this.questions[this.q_n].answered){
        this.configService.toast("Question answered already!", "danger");
      }else{
        this.questions[this.q_n].answered = 1;
        this.answered = this.answered+1;
        if(answer == this.questions[this.q_n].answer){// Check if answer is correct
          // console.log(this.questions[this.q_n].answer);
          this.configService.toast("Correct", "success");
          this.score += 1;
        }else{//  Check if answer is wrong
          this.vibration.vibrate(100);
          this.configService.toast("Wrong", "danger");
          setTimeout(()=>{
            this.configService.toast("The answer is "+this.questions[this.q_n].answer, "danger");
          }, 1500)
        }
      }
      setTimeout(()=>{
        this.nextQ();
      }, 2000);
    }
  }

  nextQ(){
    if((this.q_n + 1) == this.questions.length){
      console.log(this.q_n);
      this.configService.toast("Last Question Reached", "danger");
    }else{
      this.q_n += 1;
      this.showQuestion();
    }
  }

  prevQ(){
    // let qn = ;
    if((this.q_n) == 0){
      console.log(this.q_n);
      this.configService.toast("First Question Reached", "danger");
    }else{
      this.q_n -= 1;
      this.showQuestion();
    }
  }

  restart(){
    // this.admob.InterstitialAd();
    // // this.navCtr.navigateRoot('');
    // this.q_n = 0;
    // this.score = 0;
    // this.time = (this.questions.length * 10);
    // this.showQuestion();
    this.admob.RewardVideoAd();
    this.ngOnInit();
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
            this.openModal();
          }

      }, 1000);
  }

  async openModal() {
    this.admob.RewardVideoAd();
    const modal = await this.modalController.create({
      component: ResultPage,
      componentProps: {
        "questions": this.questions,
        "score": this.score,
        "userInfo": this.userInfo,
        "timeCredit": (this.timeCredit/2),
        "course": this.course,
        "page_name": "Result",
      }
    });
 
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        //alert('Modal Sent Data :'+ dataReturned);
      }
    });
 
    return await modal.present();
  }


  endTest(){
    if(this.q_n == (this.questions.length-1) && this.answered > 15){
      this.timeCredit = this.time;
    }else{
      this.timeCredit = 0;
    }
    // this.timeCredit = this.time;
    console.log(this.timeCredit);
    this.time = 0;
  }

  selectAnotherCourse(){
    this.storage.ready().then(()=>{
      this.storage.get('level_id').then((val: any) => {
        this.navCtr.navigateBack('/course/'+val);
      });
    });
  }

  ionViewWillLeave(){
    this.time = -1;
    console.log(this.time);
  }

  // this.StartTimer();
  // if(this.timeup)

  ionViewDidLeave(){
   this.subscribtion.unsubscribe();
  }

}
