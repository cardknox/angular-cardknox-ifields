
import { Account, DataMessage, PostDelegate, InitMessage, IssuerMessage } from "../typings";
import { CLEAR_DATA, ENABLE3DS, ENABLE_AUTO_SUBMIT, ENABLE_LOGGING, FOCUS, FORMAT, GET_TOKEN, INIT, PING, SET_ACCOUNT_DATA, SET_PLACEHOLDER, STYLE, UPDATE3DS, UPDATE_ISSUER } from "./constants";

export default class MessagePoster{

  constructor(private post: PostDelegate, private log: (message: string) => void, private type: string) { }
  
  iFrameLoaded = false;

  postMessage(data: DataMessage | InitMessage | IssuerMessage) {
    if (!this.iFrameLoaded && data.action !== PING) {
      this.log("Iframe not loaded");
      this.ping();
      return;
    }
    this.post(data, "*");
  }

  logAction(action: string) {
    this.log(`Sending message ${action}`);
  }

  ping() {
    this.logAction(PING);
    this.postMessage({
      action: PING
    });
  }

  setAccount(data: Account) {
    this.logAction(SET_ACCOUNT_DATA);
    this.postMessage({
      action: SET_ACCOUNT_DATA,
      data
    });
  }

  init() {
    this.logAction(INIT);
    this.postMessage({
      action: INIT,
      tokenType: this.type,
      referrer: window.location.toString()
    });
  }
  
  getToken() {
    this.logAction(GET_TOKEN);
    this.postMessage({
      action: GET_TOKEN
    });
  }

  enable3DS(waitForResponse?: boolean, waitForResponseTimeout?: number) {
    this.logAction(ENABLE3DS);
    this.postMessage({
      action: ENABLE3DS,
      data: {
        waitForResponse,
        waitForResponseTimeout
      }
    });
  }

  update3DS(fieldName: string, value?: string | number) {
    this.logAction(UPDATE3DS);
    this.postMessage({
      action: UPDATE3DS,
      data: {
        fieldName,
        value
      }
    });
  }

  updateIssuer(issuer: string) {
    this.logAction(UPDATE_ISSUER);
    this.postMessage({
      action: UPDATE_ISSUER,
      issuer
    });
  }

  setPlaceholder(data: string) {
    this.logAction(SET_PLACEHOLDER);
    this.postMessage({
      action: SET_PLACEHOLDER,
      data
    });
  }

  enableAutoFormat(formatChar?: string) {
    this.logAction(FORMAT);
    this.postMessage({
      action: FORMAT,
      data: {
        formatChar
      }
    });
  }
  
  enableLogging() {
    this.logAction(ENABLE_LOGGING);
    this.postMessage({
      action: ENABLE_LOGGING
    });
  }

  enableAutoSubmit(formId?: string) {
    this.logAction(ENABLE_AUTO_SUBMIT);
    this.postMessage({
      action: ENABLE_AUTO_SUBMIT,
      data: {
        formId
      }
    });
  }

  setStyle(data: any) {
    this.logAction(STYLE);
    this.postMessage({
      action: STYLE,
      data
    });
  }

  //TODO: implement
  focusIfield() {
    this.logAction(FOCUS);
    this.postMessage({
      action: FOCUS
    });
  }

  //TODO: implement
  clearIfield() {
    this.logAction(CLEAR_DATA);
    this.postMessage({
      action: CLEAR_DATA
    });
  }
}
