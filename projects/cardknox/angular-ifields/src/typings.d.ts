declare module 'angular-ifields' {
  export interface Account {
    xKey: string,
    xSoftwareName: string,
    xSoftwareVersion: string
  }
}

export interface DataMessage {
  action: string
  data?: any
}

export interface InitMessage {
  action: string,
  tokenType: string,
  referrer: string
}

export interface IssuerMessage {
  action: string,
  issuer: string,
}

export interface Account {
  xKey: string,
  xSoftwareName: string,
  xSoftwareVersion: string
}

export interface SubmitData {
  formId: string
}

export interface TokenData {
  xToken: string
  xTokenType: string
  xCardDataType: string
  xMaskedData: string
  xIssuer: string
  xTokenCreationTime: string
  xTokenVersion: string
}

export interface ErrorData {
  result: string
  errorMessage: string
  xTokenType: string
}

export interface UpdateData {
  event: string
  issuer: string
  ifieldValueChanged: boolean
  isEmpty: boolean
  isValid: boolean
  length: number
  cardNumberLength: number
}

export type eventEmitter = (name: string, event: { data: any }) => void;

export interface Options {
  enableLogging?: boolean
  autoFormat?: boolean
  autoFormatSeparator?: string
  autoSubmit?: boolean
  autoSubmitFormId?: string
  placeholder?: string
  iFieldstyle?: any
}


export interface ThreeDS {
  enable3DS?: boolean
  waitForResponse?: boolean
  waitForResponseTimeout?: number
  amount?: number
  month?: number
  year?: number
}

export type PostDelegate = (message: any, targetOrigin: string) => void;

export interface ComponentProperties {
  account?: Account,
  options: Options,
  type: string,
  issuer: string,
  threeDS: ThreeDS
}

export interface DataStore {
  iFrameLoaded: boolean,
  tokenLoading: boolean,
  tokenValid: boolean,
  tokenData?: TokenData,
  ifieldDataCache: {}
}

export interface IfieldDataCache{
  length: number,
  isEmpty: boolean,
  isValid: boolean
}