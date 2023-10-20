import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-partner',
  templateUrl: './add-partner.component.html',
  styleUrls: ['./add-partner.component.scss'],
})
export class AddPartnerComponent implements OnInit {
  partnerForm!: FormGroup;
  onSubmit: boolean = true;
  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.partnerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      contact_person_name: new FormControl('', Validators.required),
      contact_person_email_id: new FormControl('', Validators.required),
      contact_person_phone: new FormControl('', Validators.required),
      supported_mode: new FormControl('', Validators.required),
      gstn: new FormControl('', Validators.required),
      pan: new FormControl('', Validators.required),
      registration_number: new FormControl('', Validators.required),
      strength: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      skill_ids: this.fb.array([]),
      skill_id: new FormControl([]),
    });
  }

}
