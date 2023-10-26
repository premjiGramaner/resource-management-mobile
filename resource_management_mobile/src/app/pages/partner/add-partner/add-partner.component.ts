import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IonItemSliding, ModalController } from '@ionic/angular';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';
import { PartnerService } from '../service/partner.service';
import { Status } from 'src/app/core/enum/status.enum';
import { ToastService } from 'src/app/core/toast/toast.service';
import { ToastConstants } from 'src/app/core/constant/toast.message.constant';
import { DuplicateRemoverPipe } from 'src/app/shared/helpers/pipes/duplicate-remover.pipe';

@Component({
  selector: 'app-add-partner',
  templateUrl: './add-partner.component.html',
  styleUrls: ['./add-partner.component.scss'],
})
export class AddPartnerComponent implements OnInit, OnChanges {
  partnerForm!: FormGroup;
  onSubmit: boolean = true;
  selectedSkillIds: any[] = [];
  supportMode = this.staticData.partner_source_mode;
  isModalOpen = false;
  @Input() flag!: string;
  @Input() viewPartnerData!: any;
  isEnableEdit: boolean = false;
  module: string = 'partner';
  skillList: any = [];
  @Output() childFormSubmitted = new EventEmitter<FormGroup>();
  constructor(
    private removeDuplicate: DuplicateRemoverPipe,
    private toastConstants: ToastConstants,
    private staticData: StaticDataConstants,
    private partnerService: PartnerService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.getSkillList();
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
      skills: new FormControl([]),
    });
    if (this.viewPartnerData != undefined) {
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
        skills: this.viewPartnerData.skills,
      });
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    // React to changes in the input property 'data'
    if (this.flag == 'save') {
      this.isEnableEdit = false;
    } else {
      this.isEnableEdit = true;
    }
  }

  deleteSkill(i: number, sliding: IonItemSliding) {
    this.partnerForm.value.skills.splice(i, 1);
    this.arrangeSkillData(this.partnerForm.value.skills);
    sliding.close();
  }
  arrangeSkillData(skills: any) {
    this.selectedSkillIds = [];
    for (var val of skills) {
      this.skillObj(val);
    }
  }
  addSkill(skill: any) {
    skill.specialised_ind = skill.relevant_experience;
    delete skill.relevant_experience;
    delete skill.primary_skill_ind;
    delete skill.description;
    this.partnerForm.value.skills.push(skill);
    this.skillObj(skill);
  }
  skillObj(skill: any) {
    const index = this.skillList.findIndex(
      (el: any) => el.skill_id == parseInt(skill.skill_id)
    );
    if (index >= 0) {
      Object.assign(skill, { description: this.skillList[index].description });
    }
    this.selectedSkillIds.push(skill);

  }
  getSkillList() {
    this.partnerService.getSkill().subscribe((res) => {
      this.skillList = res.data.skillInfo;
      if (this.viewPartnerData != undefined) {
        const skillList = this.viewPartnerData.skills;
        skillList.map((skill: any) => {
          this.selectedSkillIds.push(skill);
        });
        this.selectedSkillIds = this.removeDuplicate.transform(
          this.selectedSkillIds
        );
      }
    });
  }

  isPartnerFormValid() {
    if (this.partnerForm.status == Status.INVALID) {
      this.onSubmit = false;
      return;
    }
    if (this.selectedSkillIds.length == 0) {
      this.toastService.presentToast(this.toastConstants.Invalid_Skill);
      return;
    }

    return this.partnerForm.valid;
  }
}
