import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { User } from 'src/app/auth/models/auth.model';
import { Common, Modules } from 'src/app/core/enum/static.enum';
import { ToastService } from 'src/app/core/toast/toast.service';
import { UserData } from 'src/app/pages/client/models/client.model';
import { ProfileService } from 'src/app/pages/profile/service/profile.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]

})
export class EditProfileComponent  implements OnInit {
  @Input() user:User | undefined;
  @Input() flag:string ='';

  addform!: FormGroup;
  showPasswordText: boolean = false;
  passwordInputType: string = Common.password;
  constructor(private modalController: ModalController, private profileService: ProfileService, private toastService: ToastService) { }

  ngOnInit() {
    if(this.user){
      if(this.flag==Common.edit){
        this.addform = new FormGroup({
          name: new FormControl(this.user.name, Validators.required),
          userName: new FormControl(this.user.user_name, Validators.required)
        });
      } else {
        this.addform = new FormGroup({
          password: new FormControl('', Validators.required),
          confirmPassword: new FormControl('', Validators.required)
        });
      }
      
    }
    
  }

  passwordMatchValidator(frm: FormGroup) {
    return frm.controls[Common.password].value === frm.controls[Common.confirmPassword].value ? true : false;
  }
  


  passwordShow() {
    this.showPasswordText = !this.showPasswordText;
    this.passwordInputType =
      this.showPasswordText == true ? Common.text : Common.password;
  }

  setClose() {
    this.modalController.dismiss();
  }

  onSubmit(form: FormGroup) {
    if (form.valid) {
      var call = this.editAPI(form,this.flag);
      if(call){
        call.subscribe({
          next: (response: UserData) => {
            this.modalController.dismiss();
            this.toastService.presentToast(response?.message)
          },
          error: (response) => {
            this.toastService.errorToast(response.message)
          },
        });
      } else {
        this.addform.controls[Common.confirmPassword].setErrors({'incorrect':true})
      }
        
    } else {
      this.addform.markAllAsTouched();
    }
  }

  editAPI(form:FormGroup,flag:string){
    if(flag==Common.edit){
      return this.profileService.editUser(form.value)
    } else {
      if(this.passwordMatchValidator(this.addform)){
        return this.profileService.changePassword(form.value)
      } else {
        return false;
      }
    }
  }
}
