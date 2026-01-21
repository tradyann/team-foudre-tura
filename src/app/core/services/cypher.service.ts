import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CypherService {
  cypherStamped(): string {
    return 'cypher#test';
    // const timestamp = Math.floor(Date.now() / 1000);
    // const pass = '#MyCypherPassword76';
    // const keySize = 256;
    // const salt = CryptoJS.lib.WordArray.random(16);
    // const key = CryptoJS.PBKDF2(pass, salt, {
    //     keySize: keySize / 32,
    //     iterations: 100
    //   });
    // const iv = CryptoJS.lib.WordArray.random(128 / 8);
    // const encrypted = CryptoJS.AES.encrypt(timestamp.toString(), key, {
    //   iv,
    //   padding: CryptoJS.pad.Pkcs7,
    //   mode: CryptoJS.mode.CBC
    // });
    // return CryptoJS.enc.Base64.stringify(salt.concat(iv).concat(encrypted.ciphertext));
  }
}
