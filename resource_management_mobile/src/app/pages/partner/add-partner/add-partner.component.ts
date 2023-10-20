import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';
import { PartnerService } from '../service/partner.service';

@Component({
  selector: 'app-add-partner',
  templateUrl: './add-partner.component.html',
  styleUrls: ['./add-partner.component.scss'],
})
export class AddPartnerComponent implements OnInit, OnChanges {
  partnerForm!: FormGroup;
  onSubmit: boolean = true;
  selectedSkillIds: any[] = [];
  supportMode = this.staticData.source_mode;
  isModalOpen = false;
  @Input() flag!: string;
  @Input() viewPartnerData!: any;
  isEnableEdit: boolean = false;
  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private staticData: StaticDataConstants,
    private partnerService: PartnerService
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

    if (this.viewPartnerData != undefined) {
      console.log(this.viewPartnerData)
      this.partnerForm.patchValue({
        name: this.viewPartnerData.name,
        contact_person_name: this.viewPartnerData.contact_person_name,
        contact_person_email_id: this.viewPartnerData.contact_person_email_id,
        contact_person_phone: this.viewPartnerData.contact_person_phone,
        supported_mode: this.viewPartnerData.supported_mode,
        gstn: this.viewPartnerData.gstn,
        pan: this.viewPartnerData.pan,
        registration_number: this.viewPartnerData.registration_number,
        strength: this.viewPartnerData.strength,
        address: this.viewPartnerData.address,
        // skill_ids: this.fb.array([]),
        // skill_id: new FormControl([]),
      })
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    // React to changes in the input property 'data'
    if (this.flag == 'save') {
      this.isEnableEdit = false;
    } else {
      this.isEnableEdit = true;
    }
    console.log(`Current value:`, changes, this.flag);

  }
  deleteSkill(i: number) {

  }

}
