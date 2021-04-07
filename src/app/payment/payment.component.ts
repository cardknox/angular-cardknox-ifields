import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ACH_TYPE, CARD_TYPE, CVV_TYPE, AngularIfieldsComponent } from 'projects/cardknox/angular-ifields/src/public-api';
import { Options } from 'projects/cardknox/angular-ifields/src/typings';
import { IfieldsHandler } from './ifieldsHandler';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  paymentForm = this.fb.group({
    name: null,
    amount: 0,
    year: null,
    month: null
  });

  @ViewChild('ach') achIfield?: AngularIfieldsComponent;
  @ViewChild('card') cardIfield?: AngularIfieldsComponent;
  @ViewChild('cvv') cvvIfield?: AngularIfieldsComponent;

  achType = ACH_TYPE;
  cardType = CARD_TYPE;
  cvvType = CVV_TYPE;
  achOptions: Options = {
    placeholder: 'Checking Account Number',
  }
  cardOptions: Options = {
    placeholder: 'Credit Card Number',
  }
  cvvOptions: Options = {
    placeholder: 'CVV',
  }

  achIfieldHandler = new IfieldsHandler();
  cardIfieldHandler = new IfieldsHandler();
  cvvIfieldHandler = new IfieldsHandler();

  account = {
    xKey: "ifields_MosheSteinDev_Test2_a0ba3a7efa01449cb",
    xSoftwareName: "vue-cardknox-ifields",
    xSoftwareVersion: "1.0.0"
  }

  constructor(private fb: FormBuilder) {
    const options = {
      iFieldstyle: {
        font: 'inherit',
        background: 'transparent',
        border: 'none',
        outline: 'none',
        padding: '0',
        margin: '0',
        width: '100%',
        maxWidth: '100%',
        verticalAlign: 'bottom',
        textAlign: 'inherit',
        boxSizing: 'content-box',
        fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
        color: 'black'
      },
      autoFormat: true,
      autoFormatSeparator: ' ',
      enableLogging: false,
      autoSubmit: false
    }
    this.achOptions = Object.assign({}, options, { placeholder: 'Checking Account Number' });
    this.cardOptions = Object.assign({}, options, { placeholder: 'Credit Card Number' });
    this.cvvOptions = Object.assign({}, options, { placeholder: 'CVV' });
  }

  get issuer() {
    return this.cardIfieldHandler.issuer || '';
  }

  private getIfieldFromType(type: string) {
    switch (type) {
      case ACH_TYPE:
        return this.achIfield;
      case CARD_TYPE:
        return this.cardIfield;
      case CVV_TYPE:
        return this.cvvIfield;
      default:
        return null;
    }
  }

  focus(type: string) {
    const ifieldComponent = this.getIfieldFromType(type);
    if (!ifieldComponent)
      throw 'unknown component';
    ifieldComponent.focusIfield();
  }
}
