import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastConstants } from 'src/app/core/constant/toast.message.constant';
import { ToastService } from 'src/app/core/toast/toast.service';
import { RequirementService } from '../../requirement/services/requirement.service';
import { ProfileService } from '../../profile/service/profile.service';
import { IonItemSliding } from '@ionic/angular';
import { Status } from 'src/app/core/enum/status.enum';
import { Modules } from 'src/app/core/enum/static.enum';
import {
  ResourceRequirementMappingsNewKeys,
  resourceData,
  resourceEntireData,
  viewResourceData,
} from '../models/resource-requirement-model';
import { userProfile } from 'src/app/core/base-model/base.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-resource-requirement',
  templateUrl: './add-resource-requirement.component.html',
  styleUrls: ['./add-resource-requirement.component.scss'],
})
export class AddResourceRequirementComponent implements OnInit, OnChanges {
  resourceForm!: FormGroup;
  isModalOpen = false;
  isDateModalOpen = false;
  isEnableEdit: boolean = false;
  module: string = Modules.Resource_requirement;
  onSubmit: boolean = true;
  userData: userProfile[] = [];
  requirementData: resourceEntireData[] = [];
  resourceId!: number;
  @Input() flag!: string;
  @Input() viewResourceData!: viewResourceData;
  addedResource: resourceData[] = [];
  constructor(
    private toastConstants: ToastConstants,
    private toastService: ToastService,
    private requirementService: RequirementService,
    private profileService: ProfileService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.getRequirementService();
    this.userService();
    this.resourceForm = new FormGroup({
      Requirement_requirement_id: new FormControl('', Validators.required),
      evaluated_by: new FormControl('', Validators.required),
      resources: new FormControl([]),
      evaluated_date: new FormControl('', Validators.required),
      comments: new FormControl('', Validators.required),
      requirement: new FormControl(''),
      evaluated_by_name: new FormControl(''),
    });

    if (this.viewResourceData != undefined) {
      let convertedDate;
      try {
        convertedDate = this.datePipe.transform(new Date(this.viewResourceData.evaluated_date), 'dd/MM/yyyy') as string
      } catch (error) {
        convertedDate = this.viewResourceData.evaluated_date
      }
      this.resourceForm.patchValue({
        comments: this.viewResourceData.comments,
        Requirement_requirement_id: '' + this.viewResourceData.Requirement_requirement_id,
        evaluated_by: '' + this.viewResourceData.evaluated_by,
        evaluated_date: convertedDate,
        evaluated_by_name: this.viewResourceData.evaluated_by_name,
        requirement: this.viewResourceData.requirement,
      });
      this.resourceId = this.viewResourceData.Requirement_requirement_id;
      this.addedResource = this.viewResourceData.ResourceRequirementMappings.map((item: any) => {
        item = item as ResourceRequirementMappingsNewKeys;
        const { resourceName, stageDescription, statusDescription, ...rest } = item;
        return {
          resource_name: resourceName,
          stage_description: stageDescription,
          status_description: statusDescription,
          ...rest,
        };
      });
      this.addedResource.map((item: resourceData) => {
        this.resourceForm.value.resources.push({
          resource_id: item.Resource_resource_id,
          stage_id: item.Stage_stage_id,
          status_id: item.Status_status_id,
        });
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.flag.toLowerCase() == Status.SAVE.toLowerCase()) {
      this.isEnableEdit = false;
    } else {
      this.isEnableEdit = true;
    }
  }

  getRequirementService() {
    this.requirementService.getRequirementAllData().subscribe((requirement) => {
      this.requirementData = requirement.data.requirementInfo;
    });
  }

  /**
   * 
   * @param event carry the date properties
   */
  evaluatedDate(event: any) {
    this.resourceForm.patchValue({
      evaluated_date: this.datePipe.transform(event.detail.value, 'dd/MM/yyyy')
    })
    this.isDateModalOpen = false;
  }

  dateInputboxClicked() {
    this.isDateModalOpen = true;
  }

  requirementSelected(event: number) {
    this.resourceId = event;
    const resourceValue = this.requirementData.find((item => event == item.requirement_id)) as resourceEntireData;
    this.resourceForm.patchValue({
      requirement: resourceValue.name
    })
  }

  evaluatedSelected(event: number) {
    const evaluatedValue = this.userData.find((item => event == item.user_id)) as userProfile;
    this.resourceForm.patchValue({
      evaluated_by_name: evaluatedValue.name
    })
  }

  userService() {
    this.profileService.getUser().subscribe((user) => {
      this.userData = user.data.userInfo;
    });
  }

  getSelectedResource(event: resourceData) {
    const ids = {
      resource_id: event.resource_id,
      stage_id: event.stage_id,
      status_id: event.status_id,
    };
    this.resourceForm.value.resources.push(ids);
    this.addedResource.push(event);
  }

  deleteSelectedResource(i: number, sliding: IonItemSliding) {
    this.resourceForm.value.resources.splice(i, 1);
    this.addedResource.splice(i, 1);
    sliding.close();
  }

  isPartnerFormValid() {
    if (this.resourceForm.status == Status.INVALID) {
      this.toastService.presentToast(this.toastConstants.all_required_field);
      return;
    }
    if (this.addedResource.length == 0) {
      this.toastService.presentToast(this.toastConstants.Invalid_Skill);
      return;
    }
    return this.resourceForm.valid;
  }
}
