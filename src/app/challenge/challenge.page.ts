import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { ConfigService } from '../service/config.service';
import { NavController, AlertController, ModalController, LoadingController } from '@ionic/angular';
import { AdmobFreeService } from '../service/admobfree.service';
import { TestPage } from '../test/test.page';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.page.html',
  styleUrls: ['./challenge.page.scss'],
})
export class ChallengePage implements OnInit {
  users: any = null;
  msg: string = "Loading Challenges ";
  loading: any;
  subscription;
  items:any;
  userInfo: any;
  challenges: any;
  challenged: any;
  challenge: Observable<any>;
  score: any;
  timeCredit: any;
  course: any;
  dataReturned: any;
  showchallenge: boolean = true;
  searching: boolean = false;
  constructor(
    private api: ApiService,
    private configService: ConfigService,
    private navCtr: NavController,
    private storage: Storage,
    private admob: AdmobFreeService,
    private alertCtr: AlertController,
    private modalController: ModalController,
    public loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.loading = 1;
    this.admob.RewardVideoAd();
    this.storage.ready().then(()=>{
      this.storage.get('user').then((user: any)=>{
        this.userInfo = user;
        // console.log(this.userInfo.user_id);
      });
    });
    this.admob.InterstitialAd();
    this.getUsers();
    // this.getChallenges(this.userInfo.user_id);
  }

  

initializeItems(){
    
    this.items = ["Ram","gopi", "dravid"];
}

  getItems(ev: any) {
    this.searching = true;
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;
    this.api.makeGetRequest(this.configService.getApiUrl()+"ApiController/searchUser/"+val).subscribe((res)=>{
      
      if(res){
        this.users =  res;
        this.searching = false;
      }
      
    });
  }

  async createChallenge(user1, user2){
    // console.log(user.name);
    let alert = await this.alertCtr.create({
      header: 'Confirm',
      message: 'Do you really want to challenge '+user1.name,
      buttons: [
        {
          text: "Yes",
          handler: () => {
            if(user1.user_id == user2.user_id){
              this.configService.toast("You can't challenge yourself", "danger");
              this.getUsers();
            }else{
              this.loading = 1;
              this.msg = "Setting Ground ...";
              // console.log(user2);
              let data = {
                'user1': user1,
                'user2': user2,
              }
              let makeC: any = this.api.makePostRequest(this.configService.getApiUrl()+"ApiController/setChallenge", data).subscribe((res: any)=>{
                // console.log(res);
                if(res){
                  // console.log(res);
                  this.loading = 0;
                  if(res.status == 1){
                    // console.log()
                    this.challenge = res.challenge_detail;
                    // console.log(this.questions);
                    this.openModal();
                    makeC.unsubscribe();
                  }
                }else{
                  makeC.unsubscribe();
                  this.msg = "An Error Occurred Please Try Again Later ...";
                  this.loading = 0;
                  this.configService.toast(this.msg, "danger");
                }
                makeC.unsubscribe();
              },
              error => {
                  this.loading = 0;
                  this.msg = "An Error Occurred Please Try Again Later ...";
                  this.configService.toast(this.msg, "danger");
                  makeC.unsubscribe();
              });
            }   
            }
          },
          {
            text: "No",
            role: 'cancel',
            handler: () => {
              
            }
          }
        ]
      });

      return alert.present();
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  

  getChallenges(user){
    // console.log(user);
    this.showchallenge = true;
    this.subscription = this.api.makeGetRequest(this.configService.getApiUrl()+"ApiController/getChallenges/"+user.user_id).subscribe((res: any)=>{
      // console.log(res);
      if(res){
        this.challenges = res.challenges;
        this.challenged = res.challenged;
        // this.users = false;
      }
    },
    error=>{
      this.configService.toast("Internet Error Occurred", "danger");
      this.loading = 0;
      console.log(error);
      // this.navCtr.navigateRoot('home');
    });
  }

  getUsers(){
    this.showchallenge = false;
    this.subscription = this.api.makeGetRequest(this.configService.getApiUrl()+'ApiController/getUsers').subscribe((res)=>{
      // console.log(res);
      this.users = res;
      this.msg = "";
      this.loading = 0;
    },
    error=>{
      this.configService.toast("Internet Error Occurred", "danger");
      this.loading = 0;
      this.navCtr.navigateRoot('home');
    });
  }

  async openModal() {
    this.admob.RewardVideoAd();
    const modal = await this.modalController.create({
      component: TestPage,
      componentProps: {
        "challenge": this.challenge,
        // "score": this.score,
        // "userInfo": this.userInfo,
        // "timeCredit": this.timeCredit,
        // "course": this.course,
        // "page_name": "Result",
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

  async accept_challenge(challenge){
    let cid: any = challenge.challenge_id;
    let loader = await this.loadingController.create({
      message: 'Accepting Challenge',
    });
    loader.present();
    let ac = this.api.makeGetRequest(this.configService.getApiUrl()+'ApiController/accept_challenge/'+cid).subscribe((res: any)=>{
      // console.log(res);
      if(res){
        if(res.status == 1){
          loader.dismiss();
          this.challenge = res.challenge;
          console.log(this.challenge);
          this.configService.toast(res.msg, "success");
          this.openModal();
        }else{
          console.log("Nothing was returned");
          loader.dismiss();
          this.configService.toast(res.msg, "danger");
        }
      }else{
        loader.dismiss();
        this.configService.toast("Internet error occured", "danger");
      }
    }, error => {
      loader.dismiss();
      this.configService.toast(error, "danger");
    });
  }

  decline_challenge(challenge, user){
    this.configService.loading("Declining Challenge");
    let ac = this.api.makeGetRequest(this.configService.getApiUrl()+'ApiController/decline_challenge/'+challenge.challenge_id+"/"+user.user_id).subscribe((res: any)=>{
      console.log(res);
      if(res){
        this.challenges = res.challenges;
        this.challenged = res.challenged;
        this.configService.toast(res.msg, "success");
      }else{
        this.configService.toast("Internet error occured", "danger");
      }
    }, error => {
      this.configService.toast(error, "danger");
    });
  }

  async viewChallenge(cha:any){
    let cid:any = cha.challenge_id;
    let uid:any = this.userInfo.user_id;
    let alert = await this.alertCtr.create({
      header: 'Chellenge Info',
      message: cha.name+' challenged you on '+cha.created_at,
      buttons: [
        {
          text: 'Accept',
          handler: () => {
            this.accept_challenge(cha);
          }
        },
        {
          text: 'Decline',
          handler: () => {
            this.decline_challenge(cha, uid);
          }
        },
        {
          text: 'Cancle',
          role: 'cancle',
          handler: () => {

          }
        }
      ]
    });
    return alert.present();
  }

  ionViewWillLeave(){
    this.subscription.unsubscribe();
  }
  

}
