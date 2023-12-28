import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ToastService } from 'src/app/core/toast/toast.service';
import { addUserResponse } from 'src/app/pages/profile/models/profile.model';
import { ProfileService } from 'src/app/pages/profile/service/profile.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class AddUserComponent implements OnInit {
  addform!: FormGroup;
  showPasswordText: boolean = false;
  passwordInputType: string = 'password';
  constructor(private modalController: ModalController, private profileService: ProfileService, private toastService: ToastService) { }

  ngOnInit() {
    this.addform = new FormGroup({
      name: new FormControl('', Validators.required),
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      roleID: new FormControl(1, Validators.required),
      
    });
  }

  passwordShow() {
    this.showPasswordText = !this.showPasswordText;
    this.passwordInputType =
      this.showPasswordText == true ? 'text' : 'password';
  }

  setClose() {
    this.modalController.dismiss();
  }

  onSubmit(form: FormGroup) {
    if (form.valid) {
      var pass = this.checkPwd(form.value.password.toString());
      if(pass == true){
        this.profileService.addUser(form.value)
        .subscribe({
          next: (response: addUserResponse) => {
            this.modalController.dismiss();
            this.toastService.presentToast(response?.message)
          },
          error: (response) => {
            this.toastService.errorToast(response.message)
          },
        });
      } else {
        this.toastService.errorToast(pass);
      }
      
    } else {
      this.addform.markAllAsTouched();
    }
  }

  checkPwd(str:string) {
    if (str.length < 8) {
        return("Too Short (Min. 8 char)");
    } else if (str.length > 50) {
        return("Too Long (Max. 50 char)");
    } else if (str.search(/\d/) == -1) {
        return("Atleast 1 number");
    } else if (str.search(/[a-zA-Z]/) == -1) {
        return("Atleast 1 letter");
    } else if (str.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
        return("Bad Charcters");
    }
    return true;
}

}
