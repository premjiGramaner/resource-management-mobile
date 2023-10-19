import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    constructor(private toastController: ToastController) { }

    async presentToast(msg: string) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 1500,
            position: 'middle',
            color: 'light',
        });
        await toast.present();
    }
}
