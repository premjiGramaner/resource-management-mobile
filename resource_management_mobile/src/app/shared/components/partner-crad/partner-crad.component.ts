import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-partner-crad',
  templateUrl: './partner-crad.component.html',
  styleUrls: ['./partner-crad.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class PartnerCradComponent  implements OnInit {

  @Input() partnerList: any;

  addform!: FormGroup;
  @Output() addPartner = new EventEmitter();
  constructor( private modalController: ModalController) { }

  ngOnInit() {
    this.addform = new FormGroup({
      partner_id: new FormControl('',Validators.required),
      shared_on: new FormControl('',Validators.required)
    });
  }

  setClose() {
    this.modalController.dismiss();
  }

  onSubmit(form:FormGroup){
    if(form.valid){
      this.addPartner.emit(form.value);
      this.modalController.dismiss();
    } else {
      this.addform.markAllAsTouched();
    }
  }

}
