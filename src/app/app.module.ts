import { ResultPageModule } from './result/result.module';
import { TestPageModule } from './test/test.module';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { ResolveService } from './service/resolve.service';
import { ConfigService } from './service/config.service';
import { ApiService } from './service/api.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

// import { FadeTransition } from '.';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { AppVersion } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
// import { Admob } from '@ionic-native/admob/ngx';

import { AnalyticsFirebase } from '@ionic-native/analytics-firebase/ngx';

import { IonicStorageModule } from '@ionic/storage';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AdmobFreeService } from './service/admobfree.service';
import { AdMobFree } from '@ionic-native/admob-free/ngx';

import { Vibration } from '@ionic-native/vibration/ngx';

import { File } from '@ionic-native/file/ngx';
import { Camera } from '@ionic-native/camera/ngx';

import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    ResultPageModule,
    TestPageModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ApiService,
    ConfigService,
    AdMobFree,
    AdmobFreeService,
    ResolveService,
    AppVersion,
    FirebaseAnalytics,
    AnalyticsFirebase,
    Vibration,
    LocalNotifications,
    Camera,
    File,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(){

  }
}
