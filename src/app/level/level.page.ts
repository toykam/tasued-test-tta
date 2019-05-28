import { NavController } from '@ionic/angular';
import { ConfigService } from './../service/config.service';
import { ApiService } from './../service/api.service';
import { Component, OnInit } from '@angular/core';
import { AdmobFreeService } from '../service/admobfree.service';
import { AnalyticsFirebase } from '@ionic-native/analytics-firebase/ngx';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-level',
  templateUrl: './level.page.html',
  styleUrls: ['./level.page.scss'],
})
export class LevelPage implements OnInit {
  msg: string = "Please wait ...";
  levels: any;
  url: string = "http://toykam.ml/level/all";
  subscription;
  loading: any;
  constructor(private storage: Storage, private analyticsFirebase: AnalyticsFirebase, private admob: AdmobFreeService, private api: ApiService, private configService: ConfigService, private navCtr: NavController) { }
  
  ngOnInit() {
    this.loading = 1;
    this.analyticsFirebase.setCurrentScreen('level')
    .then(() => console.log('View successfully tracked'))
    .catch(err => console.log('Error tracking view:', err));
    // this.configService.log_event('page_view', 'Select Level Page');
    this.admob.BannerAd();
    this.admob.InterstitialAd();
    // this.configService.loading('Please Wait');
    this.subscription = this.api.makeGetRequest(this.url).subscribe((res)=>{
      this.loading = 0;
      this.levels = res;
      this.msg = "";
    },
    error => {
      this.msg = "Error";
      this.configService.toast("Internet Error Occured! Please Try Again", 'danger');
      this.navCtr.pop();
    });
  }

  openPage(url, id){
    this.storage.ready().then(()=>{
      this.storage.set('level_id', id).then(()=>{
        console.log(id);
        // this.
        this.configService.openPage(url, 'forward');
      });
    });
  }

  ionViewDidLeave(){
   this.subscription.unsubscribe();
  }

}
