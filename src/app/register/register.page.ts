// import { ServiceAuthService } from './../service-auth.service';
import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../service/config.service';
import { ApiService } from '../service/api.service';
import { AdmobFreeService } from '../service/admobfree.service';
import { Response } from '../interface/response';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  email: any;
  name: any;
  password: any;
  registring: any;
  subscription;
  constructor( 
    private configService: ConfigService,
    private api: ApiService,
    private admob: AdmobFreeService,
    private navCtr: NavController,
    ) { }

  ngOnInit() {
    this.registring = 0;
    // this.configService.log_event('page_view', 'Register Page');
  }

  register(){
    this.registring = 1;
    this.admob.InterstitialAd();
    // this.configService.loading("Registration In Progress");
    this.subscription = this.api.makeGetRequest(this.configService.getApiUrl()+'ApiController/register?email='+this.email+'&password='+this.password+'&name='+this.name).subscribe((res: Response)=>{
      if(res){
        console.log(res);
        if(res.status == 1){
          this.registring = 0;
          // this.authState.next(true);
          this.configService.toast(res.msg, 'success');
          this.navCtr.navigateRoot('/login');
        }else{
          this.registring = 0;
          this.configService.toast(res.msg, 'danger');
        }
      }else{
        this.registring = 0;
        this.configService.toast("Internet Error ", "danger");
      }
    }),
    error => {
      this.registring = 0;
      this.configService.toast("Internet Error ", "danger");
      this.ngOnInit();
    }
  }

  ionViewWillLeave(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

}
