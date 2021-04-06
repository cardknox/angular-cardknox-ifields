import { TokenData, UpdateData } from "projects/cardknox/angular-ifields/src/typings";

export class IfieldsHandler{
  xToken?: string;
  issuer?: string;
  onToken({ data }: { data: TokenData }) {
    this.xToken = data.xToken;
  }
  setIssuer(issuer: string) {
    this.issuer = issuer;
  }
  onBlur({ data }: { data: UpdateData }) {
    this.issuer = data.issuer;
  }
}