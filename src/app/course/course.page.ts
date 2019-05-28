import { ApiService } from './../service/api.service';
import { ConfigService } from './../service/config.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AnalyticsFirebase } from '@ionic-native/analytics-firebase/ngx';

@Component({
  selector: 'app-course',
  templateUrl: './course.page.html',
  styleUrls: ['./course.page.scss'],
})
export class CoursePage implements OnInit {
  level_id: any;
  courses: any;
  url: string = "http://toykam.ml/level/courses/";
  msg: string = "Please wait ...";
  loading: any;
  constructor(
    private analyticsFirebase: AnalyticsFirebase,
    public route: ActivatedRoute,
    private configService: ConfigService,
    private api: ApiService,
    private navCtr: NavController
  ) {}

  ngOnInit() {
    this.loading = 1;
    this.analyticsFirebase.setCurrentScreen('Course')
    .then(() => console.log('View successfully tracked'))
    .catch(err => console.log('Error tracking view:', err));
    // this.configService.log_event('page_view', 'Course Page');
    this.level_id = this.route.snapshot.paramMap.get('id');
    this.api.makeGetRequest(this.url+this.level_id).subscribe((res)=>{
      // this.configService.loading('Please wait');
      if(res){
        this.courses = res;
        // console.log(res);
        this.msg = "";
        this.loading = 0;
      }else{
        this.loading = 0;
      }
    },
    error => {
      this.configService.toast("An Error Occurred! Please try again", 'danger');
      this.navCtr.pop();
      this.msg = "";
    })
  }

  openPage(url){
    this.configService.navigateToRoot(url);
  }

}
