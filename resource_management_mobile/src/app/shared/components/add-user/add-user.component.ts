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
      roleID: new FormControl(1, Validators.required),
      password: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}'),
        Validators.minLength(8)
      ]))
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
      this.addform.markAllAsTouched();
    }
  }

}
