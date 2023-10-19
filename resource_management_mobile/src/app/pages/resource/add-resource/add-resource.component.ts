import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
export class AddResourceComponent  implements OnInit {

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
    private staticData:StaticDataConstants
  ) { }

  ngOnInit() {
    this.addform = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      mobile: new FormControl('', Validators.required),
      experience: new FormControl('', Validators.required),
      source: new FormControl('',  Validators.required),
      type: new FormControl('',  Validators.required),
      partner: new FormControl(''),
      ctc: new FormControl('', Validators.required),
      ectc: new FormControl('', Validators.required),
      profileLocation: new FormControl('', Validators.required),
      preferredLocation: new FormControl('', Validators.required),
      workLocation: new FormControl('', Validators.required),
      currentLocation: new FormControl('', Validators.required),
      currentOrganisation: new FormControl('', Validators.required),
      currentOrganisationDuration: new FormControl('', Validators.required),
      noticePeriod: new FormControl('', Validators.required),
      earliestJoiningDate: new FormControl('', Validators.required),
      reasonForChange: new FormControl('', Validators.required),
      skills: new FormControl([]),
    });

    this.getLocationList();
    this.getPartnerList();
    this.getSkillList();
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

  filterSkills(){
    this.skillList = [...this.orgSkillList];
    for (var val of this.addform.value.skills) {
      this.removeItinerary(val.skill_id);
    }
    console.log(this.skillList);
  }

  removeItinerary(removeId:number){
    const index = this.skillList.findIndex((el:any) => el.skill_id === removeId)
    if (index > -1) {
      this.skillList.splice(index, 1);
    }
  }

  
  addSkill(skill:any) {
    console.log("   1   ",skill);
    this.addform.value.skills.push(skill);
    const index = this.skillList.findIndex((el:any) => el.skill_id === parseInt(skill.skill_id))
    if(index>=0){
      Object.assign(skill,{description:this.skillList[index].description})
    }
    const ind = this.rating.findIndex((el:any) => el.id === parseInt(skill.rating))
    if(ind>=0){
      Object.assign(skill,{ratingName:this.rating[ind].name})
    }   
    this.selectedSkillIds.push(skill);
    console.log("   2   ",skill);
  }
  // primaryskill(event: any) {
  //   this.skills['primary_skill'] = event.detail.checked;
  //   this.skills = '';
  // }
  setClose() {
    this.modalController.dismiss();
  }

}
