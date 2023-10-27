import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    constructor(private toastController: ToastController) { }

    async presentToast(msg: string) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 1500,
            position: 'bottom',
            color: 'light',
        });
        await toast.present();
    }

    async errorToast(msg: string) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 5000,
            buttons: [
                {
                  icon: 'close',
                  htmlAttributes: {
                    'aria-label': 'close',
                  },
                },
              ],
            
            position: 'bottom',
            color: 'danger',
        });
        await toast.present();
    }
}
