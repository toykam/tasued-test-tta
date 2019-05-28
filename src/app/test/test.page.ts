import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ApiService } from '../service/api.service';
import { ConfigService } from '../service/config.service';
import { AdmobFreeService } from '../service/admobfree.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

  constructor(
    private modalController: ModalController,
    private storage: Storage,
    private navParams: NavParams,
    private api: ApiService,
    private conf: ConfigService,
    private admob: AdmobFreeService,
  ) { }

  ngOnInit() {
    console.log(this.navParams.data.challenge);
  }

}
