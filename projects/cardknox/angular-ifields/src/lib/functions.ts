import { Account } from "../typings";
import { PLUGIN_NAME } from "./constants";

export function transformAccountData(account: Account): Account {
    const xSoftwareName = account.xSoftwareName;
    return Object.assign({}, account, { xSoftwareName: `(${PLUGIN_NAME}) ${xSoftwareName}` });
}
