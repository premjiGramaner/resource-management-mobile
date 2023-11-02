import { Component, Input, OnInit } from '@angular/core';
import { SkillService } from '../../skill/services/skill.service';
import { LocationService } from '../../location/services/location.service';
import { PartnerService } from '../../partner/services/partner.service';
import { ClientService } from '../../client/service/client.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../profile/service/profile.service';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';
import { CommonService } from 'src/app/shared/services/common.service';
import { Status } from 'src/app/core/enum/status.enum';
import { IonItemSliding, ModalController } from '@ionic/angular';
import { ToastService } from 'src/app/core/toast/toast.service';

@Component({
  selector: 'app-add-requirement',
  templateUrl: './add-requirement.component.html',
  styleUrls: ['./add-requirement.component.scss'],
})
export class AddRequirementComponent implements OnInit {
  @Input() viewData: any;
  sourceList: any = this.staticData.source_mode;
  priorityList: any = this.staticData.priority;
  statusList: any = [];
  clientList: any = [];
  userList: any = [];
  locationList: any = [];
  partnerList: any = [];
  skillList: any = [];
  orgSkillList: any = [];
  selectedSkillIds: any = [];
  selectedPartners: any = [];
  module: string = 'requirement';
  isModalOpen = false;
  addform!: FormGroup;

  constructor(private staticData: StaticDataConstants,
    private commonService: CommonService,
    private skillService: SkillService,
    private userService: ProfileService,
    private locationService: LocationService,
    private partnerService: PartnerService,
    private toastService: ToastService,
    private modalController: ModalController,
    private clientService: ClientService) { }

  ngOnInit() {
    this.getClientList();
    this.getLocationList();
    this.getSkillList();
    this.getUserList();
    this.getStatusList();
    if (this.viewData) {
      this.addform = new FormGroup({
        requirement_id: new FormControl(this.viewData.requirement_id, Validators.required),
        name: new FormControl(this.viewData.name, Validators.required),
        Client_client_id: new FormControl('' + this.viewData.Client_client_id, Validators.required),
        Location_Location_ID: new FormControl('' + this.viewData.Location_Location_ID, Validators.required),
        location_description: new FormControl(this.viewData.location_description + ' '),
        experience: new FormControl(this.viewData.experience, Validators.required),
        SPOC_id: new FormControl('' + this.viewData.SPOC_id, Validators.required),
        duration: new FormControl(this.viewData.duration, Validators.required),
        notice_period: new FormControl(this.viewData.notice_period, Validators.required),
        source_mode: new FormControl(this.viewData.source_mode, Validators.required),
        hire_budget: new FormControl(this.viewData.hire_budget),
        contract_budget: new FormControl(this.viewData.contract_budget),
        jd: new FormControl(this.viewData.jd, Validators.required),
        status: new FormControl('' + this.viewData.status, Validators.required),
        priority: new FormControl(this.viewData.priority, Validators.required),
        skills: new FormControl(this.viewData.skills),
        partner: new FormControl(this.viewData.partner),
      });
      this.arrangePartnerData(this.viewData.partner);

    } else {
      this.addform = new FormGroup({
        name: new FormControl('', Validators.required),
        Client_client_id: new FormControl('', Validators.required),
        Location_Location_ID: new FormControl('', Validators.required),
        location_description: new FormControl(' '),
        experience: new FormControl('', Validators.required),
        SPOC_id: new FormControl('', Validators.required),
        duration: new FormControl('', Validators.required),
        notice_period: new FormControl('', Validators.required),
        source_mode: new FormControl('', Validators.required),
        hire_budget: new FormControl(undefined),
        contract_budget: new FormControl(undefined),
        jd: new FormControl('', Validators.required),
        status: new FormControl('', Validators.required),
        priority: new FormControl('', Validators.required),
        skills: new FormControl([]),
        partner: new FormControl([]),
      });
    }

    this.addform.controls['source_mode'].valueChanges.subscribe(val => {
      if (val == "Both") {
        this.addform.controls['hire_budget'].setValidators([Validators.required]);
        this.addform.controls['contract_budget'].setValidators([Validators.required]);
      } else if (val == "Hire") {
        this.addform.controls['hire_budget'].setValidators([Validators.required]);
        this.addform.controls['contract_budget'].clearValidators();
      } else if (val == "Contract" || val == "Freelancing") {
        this.addform.controls['contract_budget'].setValidators([Validators.required]);
        this.addform.controls['hire_budget'].clearValidators();
      } else {
        this.addform.controls['hire_budget'].clearValidators();
        this.addform.controls['contract_budget'].clearValidators();
      }
      this.addform.controls['hire_budget'].updateValueAndValidity();
      this.addform.controls['contract_budget'].updateValueAndValidity();

      this.addform.value.partner = [];
      this.arrangePartnerData(this.addform.value.partner);

    });
  }

  getStatusList() {
    this.commonService.getStatus().subscribe((res) => {
      this.statusList = res.data.statusInfo;
    });
  }

  getClientList() {
    this.clientService.getClientAllData().subscribe((res) => {
      this.clientList = res.data.clientInfo;
    });
  }

  getUserList() {
    this.userService.getUser().subscribe((res) => {
      this.userList = res.data.userInfo;
    });
  }

  getLocationList() {
    this.locationService.getAllLocation().subscribe((res) => {
      this.locationList = res.data.locationInfo;
    });
  }

  getPartnerList(source: string, skill: Array<object>) {
    const data = {
      source: source,
      skill: skill
    };
    this.partnerService.getSkillPartner(data).subscribe((res: any) => {
      this.partnerList = res.data.partnerInfo;
    });
  }

  getSkillList() {
    this.skillService.getAllSkill().subscribe((res) => {
      this.orgSkillList = res.data.skillInfo;
      if(this.viewData){
        this.arrangeSkillData(this.viewData.skills);
      }
    });

    
  }

  isFormValid() {
    if (this.addform.status == Status.INVALID) {
      this.addform.markAllAsTouched();
      return false;
    }
    if (this.addform.value.skills.length == 0) {
      this.toastService.errorToast('Enter atleast one skill');
      return false;
    }
    if (this.addform.value.partner.length == 0) {
      this.toastService.errorToast('Enter atleast one partner');
      return false;
    }
    return this.addform.valid;
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.addform.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }


  filterSkills() {
    this.skillList = [...this.orgSkillList];
    for (var val of this.addform.value.skills) {
      this.removeItinerary(parseInt(val.skill_id));
    }
  }

  removeItinerary(removeId: number) {
    const index = this.skillList.findIndex((el: any) => el.skill_id === removeId)
    if (index > -1) {
      this.skillList.splice(index, 1);
    }
  }


  addSkill(skill: any) {
    this.addform.value.skills.push(skill);
    this.skillObj(skill);
    this.addform.value.partner = [];
    this.arrangePartnerData(this.addform.value.partner);
  }

  deleteSkill(i: number, sliding: IonItemSliding) {
    this.addform.value.skills.splice(i, 1);
    this.arrangeSkillData(this.addform.value.skills);
    this.addform.value.partner = [];
    this.arrangePartnerData(this.addform.value.partner);
    sliding.close();
  }
  arrangeSkillData(skills: any) {
    this.selectedSkillIds = [];
    for (var val of skills) {
      this.skillObj(val);
    }
  }
  skillObj(skill: any) {
    const index = this.orgSkillList.findIndex((el: any) => el.skill_id === parseInt(skill.skill_id))
    if (index >= 0) {
      Object.assign(skill, { description: this.orgSkillList[index].description })
    }

    this.selectedSkillIds.push(skill);
  }

  filterPartners() {
    this.getPartnerList(this.addform.value.source_mode, this.addform.value.skills);
  }

  addPartner(partner: any) {
    this.addform.value.partner.push(partner);
    this.partnerObj(partner);
  }

  deletePartner(i: number, sliding: IonItemSliding) {
    this.addform.value.partner.splice(i, 1);
    this.arrangePartnerData(this.addform.value.partner);
    sliding.close();

  }
  arrangePartnerData(partners: any) {
    this.selectedPartners = [];
    for (var val of partners) {
      this.partnerObj(val);
    }
  }
  partnerObj(partner: any) {
    const index = this.partnerList.findIndex((el: any) => el.partner_id === parseInt(partner.partner_id))
    if (index >= 0) {
      Object.assign(partner, { name: this.partnerList[index].name })
    }
    this.selectedPartners.push(partner);
  }

  setClose() {
    this.modalController.dismiss();
  }
}
