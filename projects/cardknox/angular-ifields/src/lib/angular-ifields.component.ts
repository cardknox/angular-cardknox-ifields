import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Account, Options, ThreeDS } from '../typings';
import { LOADED, TOKEN, AUTO_SUBMIT, UPDATE, AMOUNT, MONTH, YEAR, CARD_TYPE, CVV_TYPE, IFIELDS_VERSION } from "./constants";
import { transformAccountData } from './functions';
import MessageHandler from './message-handler';
import MessagePoster from './message-poster';

const iframeSrc = `https://cdn.cardknox.com/ifields/${IFIELDS_VERSION}/ifield.htm`;

@Component({
  selector: 'cardknox-ifields',
  template: `
  <iframe
    src="${iframeSrc}"
    title="{{type}}"
  ></iframe>
  `,
  styles: [
  ]
})
export class AngularIfieldsComponent implements AfterViewInit, OnChanges, OnInit {

  @Input() type = "";
  @Input() account?: Account;
  @Input() options: Options = {};
  @Input() threeDS: ThreeDS = {};
  @Input() issuer: string = '';

  @Output() keypress: EventEmitter<any> = new EventEmitter();
  @Output() blur: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() input: EventEmitter<any> = new EventEmitter();
  @Output() click: EventEmitter<any> = new EventEmitter();
  @Output() focus: EventEmitter<any> = new EventEmitter();
  @Output() dblclick: EventEmitter<any> = new EventEmitter();
  @Output() load: EventEmitter<any> = new EventEmitter();
  @Output() token: EventEmitter<any> = new EventEmitter();
  @Output() iFieldError: EventEmitter<any> = new EventEmitter();
  @Output() update: EventEmitter<any> = new EventEmitter();
  @Output() submit: EventEmitter<any> = new EventEmitter();


  private messagePoster?: MessagePoster;
  private messageHandler?: MessageHandler;


  get iframeContentWindow() {
    return this.elementRef.nativeElement.children[0].contentWindow;
  }

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.validateProps();
  }

  ngAfterViewInit(): void {
    this.messagePoster = new MessagePoster(this.iframeContentWindow.postMessage.bind(this.iframeContentWindow),
      this.log.bind(this), this.type);
    this.messageHandler = new MessageHandler(this.messagePoster, this.type, this.log.bind(this));
    window.addEventListener("message", this.onMessage);
    this.messagePoster?.ping();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes[propName].isFirstChange())
        continue;
      switch (propName) {
        case 'account':
          this.updateAccountChanges(changes[propName].currentValue);
          break;
        case 'threeDS':
          if (this.shouldUpdateThreeDS((changes[propName] as unknown) as ThreeDS))
            this.updateThreeDSChanges(changes[propName].currentValue, changes[propName].previousValue);
          break;
        case 'issuer':
          if (this.shouldUpdateIssuer())
            this.updateIssuerChanges(changes[propName].currentValue);
          break;
        case 'options':
          this.updateOptionsChanges(changes[propName].currentValue, changes[propName].previousValue);
          break;
      }
    }
  }

  updateOptionsChanges(val: Options, oldVal: Options) {
    if (this.type === CARD_TYPE && val.autoFormat) {
      if (
        val.autoFormat !== oldVal.autoFormat ||
        val.autoFormatSeparator !== oldVal.autoFormatSeparator
      )
        this.messagePoster?.enableAutoFormat(val.autoFormatSeparator);
    }
    if (val.autoSubmit) {
      if (
        val.autoSubmit !== oldVal.autoSubmit ||
        val.autoSubmitFormId !== oldVal.autoSubmitFormId
      )
        this.messagePoster?.enableAutoSubmit(val.autoSubmitFormId);
    }
    if (val.enableLogging && !oldVal.enableLogging)
      this.messagePoster?.enableLogging();
    if (val.placeholder && val.placeholder !== oldVal.placeholder)
      this.messagePoster?.setPlaceholder(val.placeholder);
    if (val.iFieldstyle !== oldVal.iFieldstyle)
      this.messagePoster?.setStyle(val.iFieldstyle);
  }
  updateIssuerChanges(currentValue: string) {
    this.messagePoster?.updateIssuer(currentValue);
  }
  shouldUpdateIssuer() {
    return this.type === CVV_TYPE;
  }
  updateThreeDSChanges(val: ThreeDS, oldVal: ThreeDS) {
    if (val.enable3DS)
      this.messagePoster?.enable3DS(val.waitForResponse, val.waitForResponseTimeout);
    if (val.amount !== oldVal.amount || !oldVal.enable3DS)
      this.messagePoster?.update3DS(AMOUNT, val.amount);
    if (val.month !== oldVal.month || !oldVal.enable3DS)
      this.messagePoster?.update3DS(MONTH, val.month);
    if (val.year !== oldVal.year || !oldVal.enable3DS)
      this.messagePoster?.update3DS(YEAR, val.year);
  }

  updateAccountChanges(currentValue: Account) {
    const newAccount = transformAccountData(currentValue);
    this.messagePoster?.setAccount(newAccount);
  }

  shouldUpdateThreeDS(currentValue: ThreeDS) {
    return this.type === CARD_TYPE && currentValue.enable3DS;
  }

  onMessage = (e: MessageEvent) => {
    var data = e.data;
    if (e.source !== this.iframeContentWindow) return;
    switch (data.action) {
      case LOADED:
        this.log("Message received: ifield loaded");
        this.onLoad();
        this.load.emit();
        break;
      case TOKEN:
        this.log("Message received: " + TOKEN);
        this.messageHandler?.onToken(data);
        if (this.messageHandler?.tokenValid)
          this.token.emit(data);
        else
          this.iFieldError.emit(data);
        break;
      case AUTO_SUBMIT:       //triggered when submit is fired within the iFrame
        this.log("Message received: " + AUTO_SUBMIT);
        this.submit.emit({ data });       //call first before submit is triggered
        this.messageHandler?.onSubmit(data);
        break;
      case UPDATE:
        this.log("Message received: " + UPDATE);
        this.messageHandler?.onUpdate(data);
        this.onUpdate(data);
        break;
      default:
        break;
    }
    if (this.threeDS && this.threeDS.enable3DS && data.eci && data.eci.length && this.type === CARD_TYPE) {
      this.log("Message received: eci");
      this.messagePoster?.postMessage(data);
    }
  }

  onUpdate({ data }: any) {
    switch (data.event) {
      case 'input':
        this.input.emit({ data });
        break;
      case 'click':
        this.click.emit({ data });
        break;
      case 'focus':
        this.focus.emit({ data });
        break;
      case 'dblclick':
        this.dblclick.emit({ data });
        break;
      case 'change':
        this.change.emit({ data });
        break;
      case 'blur':
        this.blur.emit({ data });
        break;
      case 'keypress':
        this.keypress.emit({ data });
        break;
      default:
        break;
    }
    this.update.emit({ data });
  }
  onLoad() {
    if (this.messagePoster)
      this.messagePoster.iFrameLoaded = true;
    if (this.account) {
      const newAccount = transformAccountData(this.account);
      this.messagePoster?.setAccount(newAccount);
    }
    if (this.type === CARD_TYPE && this.threeDS && this.threeDS.enable3DS) {
      this.messagePoster?.enable3DS(this.threeDS.waitForResponse, this.threeDS.waitForResponseTimeout);
      this.messagePoster?.update3DS(AMOUNT, this.threeDS.amount);
      this.messagePoster?.update3DS(MONTH, this.threeDS.month);
      this.messagePoster?.update3DS(YEAR, this.threeDS.year);
    }
    this.messagePoster?.init();
    if (this.type === CVV_TYPE && this.issuer)
      this.messagePoster?.updateIssuer(this.issuer);
    if (this.options.placeholder)
      this.messagePoster?.setPlaceholder(this.options.placeholder);
    if (this.options.enableLogging)
      this.messagePoster?.enableLogging();
    if (this.type === CARD_TYPE && this.options.autoFormat)
      this.messagePoster?.enableAutoFormat(this.options.autoFormatSeparator);
    if (this.options.autoSubmit)
      this.messagePoster?.enableAutoSubmit(this.options.autoSubmitFormId);
    if (this.options.iFieldstyle)
      this.messagePoster?.setStyle(this.options.iFieldstyle);
  }

  validateProps() {
    var accountProps = this.account
      ? this.account.xKey
        ? this.account.xSoftwareName
          ? this.account.xSoftwareVersion
            ? false
            : "xSoftwareVersion"
          : "xSoftwareName"
        : "xKey"
      : "account";
    if (accountProps) {
      this.error("Missing " + accountProps);
    }
    if (!this.type) this.error("Missing props (type)");
  }

  log(message: string) {
    if (this.options.enableLogging) {
      console.log(`IField ${this.type}: ${message}`);
    }
  }

  error(message: string) {
    console.error(`IField ${this.type}: ${message}`);
  }
}
