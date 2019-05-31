import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { ConfigService } from '../service/config.service';
import { NavController } from '@ionic/angular';
import { AdmobFreeService } from '../service/admobfree.service';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.page.html',
  styleUrls: ['./scoreboard.page.scss'],
})
export class ScoreboardPage implements OnInit {
  leaders: any;
  loading: boolean;
  constructor(
    private api: ApiService,
    private conf: ConfigService,
    private navCtr: NavController,
    private admob: AdmobFreeService,
  ) { }

  ngOnInit() {
    this.admob.InterstitialAd();
    this.loading = true;
    let sub = this.api.makeGetRequest(this.conf.getApiUrl()+"ApiController/getLeaders").subscribe((res: any) => {
      // console.log(res);
      if(res){
        this.loading = false;
        this.leaders = res;
      }
    },
    error=>{
      this.conf.toast("Internet Error Occurred", "danger");
      this.loading = false;
      this.navCtr.navigateRoot('home');
    });
  }

}
