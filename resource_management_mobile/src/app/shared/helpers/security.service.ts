import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  constructor() {}

  setItem(name: any, data: any) {
    let encrpt = CryptoJS.AES.encrypt(JSON.stringify(data), name).toString();
    localStorage.setItem(name, encrpt);
  }
  getItem(name: any) {
    try {
      let dycrpt: any;
      dycrpt = localStorage.getItem(name);
      if (dycrpt != null) {
        let dycrpst = CryptoJS.AES.decrypt(dycrpt, name).toString(
          CryptoJS.enc.Utf8
        );
        if (dycrpst.toString()) {
          return JSON.parse(dycrpst);
        }
        return dycrpst;
      }
    } catch (error) {}
  }
  clearItem() {
    sessionStorage.clear();
  }
}
