import { Keplr } from "@keplr-wallet/types";

declare global {
  interface Window {
    keplr?: Keplr;
    getOfflineSigner?: Keplr["getOfflineSigner"];
    getOfflineSignerAuto?: Keplr["getOfflineSignerAuto"];
  }
}

export {};
