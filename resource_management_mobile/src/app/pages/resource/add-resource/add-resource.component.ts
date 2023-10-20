import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Status } from 'src/app/core/enum/status.enum';
import { ResourceService } from '../service/resource.service';
import { ToastService } from 'src/app/core/toast/toast.service';
import { ModalController } from '@ionic/angular';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';
@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  styleUrls: ['./add-resource.component.scss'],
})
export class AddResourceComponent implements OnInit {
  @Input() viewData: any;

  addform!: FormGroup;
  @Output() childFormSubmitted = new EventEmitter<FormGroup>();
  onSubmit: boolean = true;
  locationList: any = [];
  partnerList: any = [];
  skillList: any = [];
  orgSkillList: any = [];
  selectedSkillIds: any = [];
  skills: any;
  isModalOpen = false;
  sourceList = this.staticData.source;
  typeList = this.staticData.type;
  rating = this.staticData.rating;

  constructor(
    private resourceService: ResourceService,
    private toastService: ToastService,
    private modalController: ModalController,
    private staticData: StaticDataConstants
  ) { }

  ngOnInit() {
    this.getLocationList();
    this.getPartnerList();
    this.getSkillList();
    console.log(this.viewData)
    if (this.viewData) {
      this.addform = new FormGroup({
        name: new FormControl(this.viewData.name, Validators.required),
        email_id: new FormControl(this.viewData.email_id, Validators.required),
        mobile_no: new FormControl(this.viewData.mobile_no, Validators.required),
        experience: new FormControl(this.viewData.experience, Validators.required),
        source: new FormControl(this.viewData.source, Validators.required),
        type: new FormControl(this.viewData.type, Validators.required),
        Partner_partner_id: new FormControl(''+this.viewData.Partner_partner_id),
        ctc: new FormControl(this.viewData.ctc, Validators.required),
        ectc: new FormControl(this.viewData.ectc, Validators.required),
        profile_location: new FormControl(''+this.viewData.profile_location, Validators.required),
        preferred_location: new FormControl(''+this.viewData.preferred_location, Validators.required),
        work_location: new FormControl(''+this.viewData.work_location, Validators.required),
        current_location: new FormControl(''+this.viewData.current_location, Validators.required),
        current_organisation: new FormControl(this.viewData.current_organisation, Validators.required),
        current_org_duration: new FormControl(this.viewData.current_org_duration, Validators.required),
        notice_period: new FormControl(this.viewData.notice_period, Validators.required),
        earliest_joining_date: new FormControl(this.viewData.earliest_joining_date.replace(/\//g, '-'), Validators.required),
        reason_for_change: new FormControl(this.viewData.reason_for_change, Validators.required),
        skills: new FormControl(this.viewData.skills),
      });
      this.arrangeSkillData(this.viewData.skills);
    } else {
      this.addform = new FormGroup({
        name: new FormControl('', Validators.required),
        email_id: new FormControl('', Validators.required),
        mobile_no: new FormControl('', Validators.required),
        experience: new FormControl('', Validators.required),
        source: new FormControl('', Validators.required),
        type: new FormControl('', Validators.required),
        Partner_partner_id: new FormControl(''),
        ctc: new FormControl('', Validators.required),
        ectc: new FormControl('', Validators.required),
        profile_location: new FormControl('', Validators.required),
        preferred_location: new FormControl('', Validators.required),
        work_location: new FormControl('', Validators.required),
        current_location: new FormControl('', Validators.required),
        current_organisation: new FormControl('', Validators.required),
        current_org_duration: new FormControl('', Validators.required),
        notice_period: new FormControl('', Validators.required),
        earliest_joining_date: new FormControl('', Validators.required),
        reason_for_change: new FormControl('', Validators.required),
        skills: new FormControl([]),
      });
    }



  }
  isFormValid() {
    if (this.addform.status == Status.INVALID) {
      this.onSubmit = false;
      return false;
    }
    if (this.selectedSkillIds.length == 0) {
      this.toastService.presentToast('Enter atleast one skill');
      return false;
    }
    return this.addform.valid;
  }

  getLocationList() {
    this.resourceService.getLocation().subscribe((res) => {
      this.locationList = res.data.locationInfo;
    });
  }

  getPartnerList() {
    this.resourceService.getPartner().subscribe((res) => {
      this.partnerList = res.data.partnerInfo;
    });
  }

  getSkillList() {
    this.resourceService.getSkill().subscribe((res) => {
      this.orgSkillList = res.data.skillInfo;
    });
  }

  filterSkills() {
    this.skillList = [...this.orgSkillList];
    for (var val of this.addform.value.skills) {
      this.removeItinerary(val.skill_id);
    }
    console.log(this.skillList);
  }

  removeItinerary(removeId: number) {
    const index = this.skillList.findIndex((el: any) => el.skill_id === removeId)
    if (index > -1) {
      this.skillList.splice(index, 1);
    }
  }


  addSkill(skill: any) {
    console.log("   1   ", skill);
    this.addform.value.skills.push(skill);
    this.skillObj(skill);
  }

  arrangeSkillData(skills:any){
    this.selectedSkillIds = [];
    for (var val of skills) {
      this.skillObj(val);
    }
  }
  skillObj(skill:any){
    // const index = this.skillList.findIndex((el: any) => el.skill_id === parseInt(skill.skill_id))
    // if (index >= 0) {
      Object.assign(skill, { description: skill.skill.description })
    // }
    const ind = this.rating.findIndex((el: any) => el.id === parseInt(skill.rating))
    if (ind >= 0) {
      Object.assign(skill, { ratingName: this.rating[ind].name })
    }
    this.selectedSkillIds.push(skill);
    console.log("   2   ", skill);
  }
  // primaryskill(event: any) {
  //   this.skills['primary_skill'] = event.detail.checked;
  //   this.skills = '';
  // }
  setClose() {
    this.modalController.dismiss();
  }

}
