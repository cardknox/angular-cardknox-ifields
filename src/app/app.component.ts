import { Component } from '@angular/core';
import { TokenData, UpdateData } from 'projects/cardknox/angular-ifields/src/typings';
import { CARD_TYPE, CVV_TYPE } from "../../projects/cardknox/angular-ifields/src/public-api";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'test';
  cardType = CARD_TYPE;
  cvvType = CVV_TYPE;
  issuer = '';
  cardOptions = {
    enableLogging: false,
    autoFormat: true,
    autoFormatSeparator: ' ',
    autoSubmit: true,
    autoSubmitFormId: undefined,
    placeholder: 'Card Number',
    iFieldstyle: {}
  }
  cvvOptions = {
    enableLogging: false,
    autoFormat: true,
    autoFormatSeparator: ' ',
    autoSubmit: true,
    autoSubmitFormId: undefined,
    placeholder: 'CVV',
    iFieldstyle: {}
  }
  account = {
    xKey: "ifields_MosheSteinDev_Test2_a0ba3a7efa01449cb",
    xSoftwareName: "vue-cardknox-ifields",
    xSoftwareVersion: "1.0.0"
  }
  threeDS = {
    enable3DS: false,
    waitForResponse: false,
    waitForResponseTimeout: 0,
    amount: 1,
    month: 1,
    year: 30
  }
  onLoad() {
    console.log('app - loaded')
  }
  onBlur({ data }: { data: UpdateData }) {
    console.log('app - update', data);
    if (data.issuer) this.issuer = data.issuer;
  }
  onToken({ data }: { data: TokenData }) {
    console.log('app - token', data);
  }
  ngOnInit() {
  }
}
