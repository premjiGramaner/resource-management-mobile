import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Status } from 'src/app/core/enum/status.enum';
import { ToastService } from 'src/app/core/toast/toast.service';
import {
  IonItemSliding,
  ItemSlidingCustomEvent,
  ModalController,
} from '@ionic/angular';
import {
  StaticDataConstants,
  ratingData,
} from 'src/app/core/constant/staticData.constants';
import { SkillService } from '../../skill/services/skill.service';
import { LocationService } from '../../location/services/location.service';
import { PartnerService } from '../../partner/services/partner.service';
import { skill as Skill, resourceData } from '../models/resource.model';
import {
  locationData,
  locationResponse,
} from '../../location/models/location.model';
import {
  partnerData,
  partnerResponce,
} from '../../partner/models/partner.model';
import { skillResponce } from '../../skill/models/skill.model';
import {
  CustomDropDownData,
  DropdownEvent,
  skill,
} from 'src/app/core/base-model/base.model';
import { Modules } from 'src/app/core/enum/static.enum';
import { ToastConstants } from 'src/app/core/constant/toast.message.constant';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  styleUrls: ['./add-resource.component.scss'],
})
export class AddResourceComponent implements OnInit {
  @Input() viewData: resourceData | undefined;
  addform!: FormGroup;
  @Output() childFormSubmitted = new EventEmitter<FormGroup>();
  onSubmit: boolean = true;
  sourceListDropDownData!: CustomDropDownData;
  sourceListSelectedDropDownData: string = '';
  partnerListDropDownData!: CustomDropDownData;
  partnerListSelectedDropDownData: string = '';
  typeListDropDownData!: CustomDropDownData;
  typeListSelectedDropDownData: string = '';
  locationListDropDownData!: CustomDropDownData;
  locationListSelectedDropDownData: string = '';
  workLocationDropDownData!: CustomDropDownData;
  workLocationListSelectedDropDownData: string = '';
  currentLocationDropDownData!: CustomDropDownData;
  currentLocationSelectedDropDownData: string = '';
  locationList: locationData[] = [];
  partnerList: partnerData[] = [];
  skillList: skill[] = [];
  orgSkillList: skill[] = [];
  selectedSkillIds: any = [];
  isModalOpen = false;
  sourceList: string[] = this.staticData.source;
  typeList: string[] = this.staticData.type;
  rating: ratingData[] = this.staticData.rating;
  module: string = Modules.Resource;
  constructor(
    private skillService: SkillService,
    private locationService: LocationService,
    private partnerService: PartnerService,
    private toastService: ToastService,
    private toastConstants: ToastConstants,
    private modalController: ModalController,
    private staticData: StaticDataConstants,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.getLocationList();
    this.getPartnerList();
    this.getSkillList();
    if (this.viewData) {
      this.currentLocationSelectedDropDownData =
        this.viewData.current_location_name;
      this.locationListSelectedDropDownData =
        this.viewData.preferred_location_name;
      this.workLocationListSelectedDropDownData =
        this.viewData.work_location_name;
      this.typeListSelectedDropDownData = this.viewData.type;
      this.partnerListSelectedDropDownData = this.viewData.partner_name!;
      this.sourceListSelectedDropDownData = this.viewData.source;
      this.addform = new FormGroup({
        resource_id: new FormControl(
          this.viewData.resource_id,
          Validators.required
        ),
        name: new FormControl(this.viewData.name, Validators.required),
        email_id: new FormControl(this.viewData.email_id, Validators.required),
        mobile_no: new FormControl(
          this.viewData.mobile_no,
          Validators.required
        ),
        experience: new FormControl(
          this.viewData.experience,
          Validators.required
        ),
        source: new FormControl(this.viewData.source, Validators.required),
        type: new FormControl(this.viewData.type, Validators.required),
        Partner_partner_id: new FormControl(
          '' + this.viewData.Partner_partner_id
        ),
        ctc: new FormControl(this.viewData.ctc, Validators.required),
        ectc: new FormControl(this.viewData.ectc, Validators.required),
        profile_location: new FormControl(
          '' + this.viewData.profile_location,
          Validators.required
        ),
        preferred_location: new FormControl(
          '' + this.viewData.preferred_location,
          Validators.required
        ),
        work_location: new FormControl(
          '' + this.viewData.work_location,
          Validators.required
        ),
        current_location: new FormControl(
          '' + this.viewData.current_location,
          Validators.required
        ),
        current_organisation: new FormControl(
          this.viewData.current_organisation,
          Validators.required
        ),
        current_org_duration: new FormControl(
          this.viewData.current_org_duration,
          Validators.required
        ),
        notice_period: new FormControl(
          this.viewData.notice_period,
          Validators.required
        ),
        earliest_joining_date: new FormControl(
          this.viewData.earliest_joining_date.replace(/\//g, '/'),
          Validators.required
        ),
        reason_for_change: new FormControl(
          this.viewData.reason_for_change,
          Validators.required
        ),
        skills: new FormControl(this.viewData.skills),
      });
      this.arrangeSkillData(this.viewData.skills);
    } else {
      this.addform = new FormGroup({
        name: new FormControl('', Validators.required),
        email_id: new FormControl('', [Validators.required, Validators.email]),
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

    this.addform.controls['source'].valueChanges.subscribe((val) => {
      if (val == 'Partner') {
        this.addform.controls['Partner_partner_id'].setValidators([
          Validators.required,
        ]);
      } else {
        this.addform.controls['Partner_partner_id'].clearValidators();
      }
      this.addform.controls['Partner_partner_id'].updateValueAndValidity();
    });

    this.sourceListDropDownData = {
      title: '',
      data: this.sourceList as [],
      config: {
        displayKey: '',
        placeholder: this.toastConstants.select_source_placeholder,
        searchOnKey: '',
        search: true,
      },
    };
    this.typeListDropDownData = {
      title: '',
      data: this.typeList as [],
      config: {
        displayKey: '',
        placeholder: this.toastConstants.select_type_placeholder,
        searchOnKey: '',
        search: true,
      },
    };
    this.partnerListDropDownData = {
      title: '',
      config: {
        displayKey: 'name',
        placeholder: this.toastConstants.select_partner_placeholder,
        searchOnKey: 'name',
        search: true,
      },
    };
    this.locationListDropDownData = {
      title: '',
      config: {
        displayKey: 'Description',
        placeholder: this.toastConstants.select_location_placeholder,
        searchOnKey: 'Description',
        search: true,
      },
    };
    this.workLocationDropDownData = {
      title: '',
      config: {
        displayKey: 'Description',
        placeholder: this.toastConstants.work_select_location_placeholder,
        searchOnKey: 'Description',
        search: true,
      },
    };
    this.currentLocationDropDownData = {
      title: '',
      config: {
        displayKey: 'Description',
        placeholder: this.toastConstants.current_select_location_placeholder,
        searchOnKey: 'Description',
        search: true,
      },
    };
  }

  isFormValid() {
    if (this.addform.status == Status.INVALID) {
      this.onSubmit = false;
      this.addform.markAllAsTouched();
      return false;
    }
    if (this.addform.value.skills.length == 0) {
      this.toastService.errorToast(this.toastConstants.Invalid_Skill);
      return false;
    }
    return this.addform.valid;
  }

  getLocationList() {
    this.locationService.getAllLocation().subscribe((res: locationResponse) => {
      this.locationList = res.data.locationInfo;
      this.locationListDropDownData.data = res.data.locationInfo as [];
      this.workLocationDropDownData.data = res.data.locationInfo as [];
      this.currentLocationDropDownData.data = res.data.locationInfo as [];
    });
  }

  getPartnerList() {
    this.partnerService.getAllPartner().subscribe((res: partnerResponce) => {
      this.partnerList = res.data.partnerInfo;
      this.partnerListDropDownData.data = res.data.partnerInfo as [];
    });
  }

  getSkillList() {
    this.skillService.getAllSkill().subscribe((res: skillResponce) => {
      this.orgSkillList = res.data.skillInfo;
    });
  }

  /**
   *
   * @param event contain dynamic values
   */

  sourceListDropDownEvent(event: any) {
    event as DropdownEvent;
    this.addform.patchValue({
      source: event.value,
    });
  }
  partnerListDropDownEvent(event: any) {
    event as DropdownEvent;
    this.addform.patchValue({
      Partner_partner_id: event.value.partner_id,
    });
  }
  typeListDropDownEvent(event: any) {
    event as DropdownEvent;
    this.addform.patchValue({
      type: event.value,
    });
  }
  locationListDropDownEvent(event: any) {
    event as DropdownEvent;
    this.addform.patchValue({
      preferred_location: event.value.Location_ID,
    });
  }
  workLocationListDropDownEvent(event: any) {
    event as DropdownEvent;
    this.addform.patchValue({
      work_location: event.value.Location_ID,
    });
  }
  currentLocationDropDownEvent(event: any) {
    event as DropdownEvent;
    this.addform.patchValue({
      current_location: event.value.Location_ID,
    });
  }

  filterSkills() {
    this.skillList = [...this.orgSkillList];
    for (var val of this.addform.value.skills) {
      this.removeItinerary(parseInt(val.skill_id));
    }
  }

  removeItinerary(removeId: number) {
    const index = this.skillList.findIndex(
      (el: skill) => el.skill_id === removeId
    );
    if (index > -1) {
      this.skillList.splice(index, 1);
    }
  }

  addSkill(skill: any) {
    skill.rating = parseInt(skill.rating);
    this.addform.value.skills.push(skill);
    this.skillObj(skill);
  }

  deleteSkill(i: number, sliding: IonItemSliding) {
    this.addform.value.skills.splice(i, 1);
    this.arrangeSkillData(this.addform.value.skills);
    sliding.close();
  }
  arrangeSkillData(skills: Skill[]) {
    this.selectedSkillIds = [];
    for (var val of skills) {
      this.skillObj(val);
    }
  }
  skillObj(skill: Skill) {
    const index = this.skillList.findIndex(
      (el: skill) => el.skill_id === skill.skill_id
    );
    if (index >= 0) {
      Object.assign(skill, { description: this.skillList[index].description });
    }
    const ind = this.rating.findIndex(
      (el: ratingData) => el.id === skill.rating
    );
    if (ind >= 0) {
      Object.assign(skill, { ratingName: this.rating[ind].name });
    }
    this.selectedSkillIds.push(skill);
  }

  setClose() {
    this.modalController.dismiss();
  }

  /**
   *
   * @param event carry the date properties
   */
  evaluatedDate(event: any) {
    this.addform.patchValue({
      earliest_joining_date: this.datePipe.transform(
        event.detail.value,
        'dd/MM/yyyy'
      ),
    });
    this.setClose();
  }
}
