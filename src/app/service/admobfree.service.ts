import { Injectable } from "@angular/core";
import {
  AdMobFree,
  AdMobFreeBannerConfig,
  AdMobFreeInterstitialConfig,
  AdMobFreeRewardVideoConfig
} from '@ionic-native/admob-free/ngx';
import { Platform } from '@ionic/angular';
 
 
@Injectable()
export class AdmobFreeService {
 
  //Interstitial Ad's Configurations
  interstitialConfig: AdMobFreeInterstitialConfig = {
    isTesting: false,
    autoShow: true,
    id: "ca-app-pub-4504479228598196/7018778966",
  };
 
  // Reward Video Ad's Configurations
  RewardVideoConfig: AdMobFreeRewardVideoConfig = {
    isTesting: false,
    autoShow: false,//,
    id: "ca-app-pub-4504479228598196/8859964937",
  };
 
  constructor(
    private admobFree: AdMobFree,
    public platform: Platform
  ) {
 
    platform.ready().then(() => {
 
      // Load ad configuration
      this.admobFree.interstitial.config(this.interstitialConfig);
      //Prepare Ad to Show
      this.admobFree.interstitial.prepare()
        .then(() => {
          console.log("interestial ads shown");
          this.admobFree.interstitial.show();
        });
 
 
      // Load ad configuration
      this.admobFree.rewardVideo.config(this.RewardVideoConfig);
      // Prepare Ad to Show
      this.admobFree.rewardVideo.prepare()
        .then(() => {
          console.log("Video Ads Shown");
          // this.re
        });
 
    });
 
    //Handle interstitial's close event to Prepare Ad again
    this.admobFree.on('admob.interstitial.events.CLOSE').subscribe(() => {
      this.admobFree.interstitial.prepare()
        .then(() => {
          console.log("Interstitial CLOSE");
        });
    });
    //Handle Reward's close event to Prepare Ad again
    this.admobFree.on('admob.rewardvideo.events.CLOSE').subscribe(() => {
      this.admobFree.rewardVideo.prepare()
        .then(() => {
          console.log("Reward Video CLOSE");
        });
    });
  }
 
 
  BannerAd() {
    let bannerConfig: AdMobFreeBannerConfig = {
      isTesting: false,
      id: "ca-app-pub-4504479228598196/6751772384",
      autoShow: true,
    };
    this.admobFree.banner.config(bannerConfig);
 
    this.admobFree.banner.prepare().then(() => {
      // success
      console.log("banner ads shown");
    }).catch((e)=>{
      console.log(e);
    });
  }
 
  InterstitialAd() {
    //Check if Ad is loaded
    this.admobFree.interstitial.isReady().then(() => {
      //Will show prepared Ad
      console.log("Interestial Is prepared");
      this.admobFree.interstitial.show().then(() => {
        console.log("Interestial Ads Shown");
      });
    });
  }
 
  RewardVideoAd() {
    //Check if Ad is loaded
    this.admobFree.rewardVideo.isReady().then(() => {
      //Will show prepared Ad
      this.admobFree.rewardVideo.show().then(() => {
      })
        .catch(e => console.log("show " + e));
    })
      .catch(e => console.log("isReady " + e));
  }
 
 
}