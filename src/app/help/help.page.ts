import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    speed: 500
  };
  isloggedIn: boolean;
  constructor(
    private navCtr: NavController,
    private storage: Storage,
  ) { }

  ngOnInit() {
    this.storage.ready().then(()=>{
      this.storage.get('user').then((val: any)=> {
        if(val){
          this.isloggedIn = true;
        }else{
          this.isloggedIn = false;
        }
      })
    })
  }

  openPage(url){
    this.navCtr.navigateRoot(url);
  }

  skip(){
    if(this.isloggedIn){
      this.openPage('/home');
    }else{
      this.openPage('/login');
    }
  }

}
