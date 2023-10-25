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
export class AddRequirementComponent  implements OnInit {
  @Input() viewData: any;
  sourceList:any = this.staticData.source_mode;
  priorityList:any = this.staticData.priority;
  statusList:any = [];
  clientList: any = [];
  userList:any=[];
  locationList: any = [];
  partnerList: any = [];
  skillList: any = [];
  orgSkillList: any = [];
  selectedSkillIds: any = [];
  module:string = 'requirement';
  isModalOpen = false;
  addform!: FormGroup;

  constructor(private staticData:StaticDataConstants,
    private commonService: CommonService,
    private skillService: SkillService,
    private userService:ProfileService,
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
        name: new FormControl(this.viewData.name, Validators.required),
        Client_client_id: new FormControl(''+this.viewData.Client_client_id, Validators.required),
        Location_Location_ID: new FormControl(''+this.viewData.Location_Location_ID, Validators.required),
        location_description: new FormControl(this.viewData.location_description+' '),
        experience: new FormControl(this.viewData.experience, Validators.required),
        SPOC_id: new FormControl(''+this.viewData.SPOC_id,Validators.required),
        duration: new FormControl(this.viewData.duration, Validators.required),
        notice_period: new FormControl(this.viewData.notice_period, Validators.required),
        source_mode: new FormControl(this.viewData.source_mode, Validators.required),
        hire_budget: new FormControl(this.viewData.hire_budget),
        contract_budget: new FormControl(this.viewData.contract_budget),
        jd: new FormControl(this.viewData.jd, Validators.required),
        status: new FormControl(''+this.viewData.status, Validators.required),
        priority: new FormControl(this.viewData.priority, Validators.required),
        skills: new FormControl(this.viewData.skills,Validators.required),
        partner: new FormControl(this.viewData.partner,Validators.required),
      });
      this.arrangeSkillData(this.viewData.skills);
    } else {
      this.addform = new FormGroup({
        name: new FormControl('', Validators.required),
        Client_client_id: new FormControl('', Validators.required),
        Location_Location_ID: new FormControl('', Validators.required),
        location_description: new FormControl(' '),
        experience: new FormControl('', Validators.required),
        SPOC_id: new FormControl('',Validators.required),
        duration: new FormControl('', Validators.required),
        notice_period: new FormControl('', Validators.required),
        source_mode: new FormControl('', Validators.required),
        hire_budget: new FormControl(''),
        contract_budget: new FormControl(''),
        jd: new FormControl('', Validators.required),
        status: new FormControl('', Validators.required),
        priority: new FormControl('', Validators.required),
        skills: new FormControl([],Validators.required),
        partner: new FormControl([],Validators.required),
      });
    }

    this.addform.controls['source_mode'].valueChanges.subscribe(val => {
      if (val=="Both") {
        this.addform.controls['hire_budget'].setValidators([Validators.required]);
        this.addform.controls['contract_budget'].setValidators([Validators.required]);
      } else if(val=="Hire") {
        this.addform.controls['hire_budget'].setValidators([Validators.required]);
        this.addform.controls['contract_budget'].clearValidators();
      } else if(val=="Contract" || val=="Freelancing"){
        this.addform.controls['contract_budget'].setValidators([Validators.required]);
        this.addform.controls['hire_budget'].clearValidators();
      } else {
        this.addform.controls['hire_budget'].clearValidators();
        this.addform.controls['contract_budget'].clearValidators();
      }
      this.addform.controls['hire_budget'].updateValueAndValidity();
      this.addform.controls['contract_budget'].updateValueAndValidity();
    });
  }

  getStatusList(){
    this.commonService.getStatus().subscribe((res) => {
      this.statusList = res.data.statusInfo;
    });
  }

  getClientList() {
    this.clientService.getClientAllData().subscribe((res) => {
      this.clientList = res.data.clientInfo;
    });
  }

  getUserList(){
    this.userService.getUser().subscribe((res) => {
      this.userList = res.data.userInfo;
    });
  }

  getLocationList() {
    this.locationService.getAllLocation().subscribe((res) => {
      this.locationList = res.data.locationInfo;
    });
  }

  getPartnerList(source:string, skill:Array<object>) {
    const data = {
      source: source,
      skill:skill
    };
    this.partnerService.getSkillPartner(data).subscribe((res:any) => {
      this.partnerList = res.data.partnerInfo;
    });
  }

  getSkillList() {
    this.skillService.getAllSkill().subscribe((res) => {
      this.orgSkillList = res.data.skillInfo;
    });
  }

  isFormValid() {
    if (this.addform.status == Status.INVALID) {      
      this.addform.markAllAsTouched();
      return false;
    }
    if (this.selectedSkillIds.length == 0) {
      this.toastService.errorToast('Enter atleast one skill');
      return false;
    }
    return this.addform.valid;
  }

  filterSkills() {
    this.skillList = [...this.orgSkillList];
    for (var val of this.addform.value.skills) {
      this.removeItinerary(val.skill_id);
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
  }

  deleteSkill(i:number,sliding:IonItemSliding){
    this.addform.value.skills.splice(i,1);
    this.arrangeSkillData(this.addform.value.skills);
    sliding.close();

  }
  arrangeSkillData(skills:any){
    this.selectedSkillIds = [];
    for (var val of skills) {
      this.skillObj(val);
    }
  }
  skillObj(skill:any){
    const index = this.skillList.findIndex((el: any) => el.skill_id === parseInt(skill.skill_id))
    if (index >= 0) {
      Object.assign(skill, { description: this.skillList[index].description })
    }
    
    this.selectedSkillIds.push(skill);
  }
  
  setClose() {
    this.modalController.dismiss();
  }
}
