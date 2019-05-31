import { AdmobFreeService } from './../service/admobfree.service';
import { ApiService } from './../service/api.service';
import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { User } from '../interface/user';
import { ConfigService } from '../service/config.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {
  userInfo: User;
  levels: any;
  name: any;
  email: any;
  level: any;
  department: any;
  phone_number: any;
  username: any;
  isUpdating: boolean;
  subscription;
  constructor(
    private storage: Storage,
    private api: ApiService,
    private conf: ConfigService,
    private admob: AdmobFreeService,
  ) { }

  ngOnInit() {
    // this.conf.log_event('page_view', 'Profile Edit');
    this.admob.RewardVideoAd();
    this.isUpdating = false;
    this.storage.ready().then(()=>{
      this.storage.get('user').then((res: User) => {
        this.userInfo = res;
        this.name = this.userInfo.name;
        this.email = this.userInfo.email;
        this.phone_number = this.userInfo.phone_number;
        this.username = this.userInfo.user_name;
        this.department = this.userInfo.department;
        this.level = this.userInfo.level;
      })
    })
  }

  update(){
    this.isUpdating = true;
    // this.conf.loading("Updating Profile");
    let data = "?name="+this.name+"&email="+this.email+"&phone_number="+this.phone_number+"&user_name="+this.username+"&department="+this.department+"&level="+this.level;
    this.subscription = this.api.makeGetRequest(this.conf.getApiUrl()+"ApiController/update_profile/"+this.userInfo.user_id+data).subscribe((res:any)=>{
      if(res && res.status == 1){
        this.storage.ready().then(()=>{
          this.storage.set('user', res.info).then(()=>{
            this.storage.set('user_credit', res.credit).then(()=>{
              this.conf.toast(res.msg, 'success');
              this.ngOnInit();
            });
            // this.conf.toast(res.msg, 'success');
            // this.ngOnInit();
          });
        });
      }else{
        this.conf.toast(res.msg, 'danger');
        this.ngOnInit();
      }
        
    }, error => {
      this.conf.toast("Internet Error Occured", 'danger');
      this.ngOnInit();
    });
  }

  ionViewWillLeave(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

}
