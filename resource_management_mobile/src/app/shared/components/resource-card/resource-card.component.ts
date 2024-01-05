import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ToastConstants } from 'src/app/core/constant/toast.message.constant';
import { ToastService } from 'src/app/core/toast/toast.service';
import { ResourceRequirementService } from 'src/app/pages/resource-requirement/services/resource-requirement.service';
import { CommonService } from '../../services/common.service';
import { resourceId } from 'src/app/pages/resource-requirement/models/resource-requirement-model';
import {
  resourceData,
  resourceResponse,
  stageData,
  stageResponse,
  statusData,
  statusResponse,
} from '../../models/common.model';
import { SearchableDropdownComponent } from '../searchable-dropdown/searchable-dropdown.component';
import { CustomDropDownData } from 'src/app/core/base-model/base.model';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';
import { SelectDropDownModule } from 'ngx-select-dropdown';

@Component({
  selector: 'app-resource-card',
  templateUrl: './resource-card.component.html',
  styleUrls: ['./resource-card.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    SearchableDropdownComponent,
    SelectDropDownModule,
  ],
})
export class ResourceCardComponent implements OnInit {
  @Input() resourceId: any;
  resourceform!: FormGroup;
  resourceData: resourceData[] = [];
  StatusData: statusData[] = [];
  StageData: stageData[] = [];

  resourceName!: string;
  stageDescription!: string;
  statusDescription!: string;

  resourceDropDownData!: CustomDropDownData;
  stageDropDownData!: CustomDropDownData;
  statusDropDownData!: CustomDropDownData;

  @Output() addResource = new EventEmitter();
  constructor(
    private modalController: ModalController,
    private resourceRequirementService: ResourceRequirementService,
    private toastConstants: ToastConstants,
    private toastService: ToastService,
    private commonService: CommonService,
    private staticDataConstants: StaticDataConstants
  ) {
    this.resourceDropDownData = {
      title: toastConstants.resource_card_placeholder,
      config: {
        displayKey: 'name',
        placeholder: toastConstants.resource_card_placeholder,
        searchOnKey: 'name',
        search: true,
      },
    };
    this.stageDropDownData = {
      title: this.toastConstants.resource_card_stage_placeholder,
      config: {
        displayKey: 'description',
        placeholder: this.toastConstants.resource_card_stage_placeholder,
        searchOnKey: 'description',
        search: true,
      },
    };
    this.statusDropDownData = {
      title: '',
      config: {
        displayKey: 'description',
        placeholder: this.toastConstants.resource_card_status_placeholder,
        searchOnKey: 'description',
        search: true,
      },
    };
  }

  ngOnInit() {
    this.resourceform = new FormGroup({
      resource_id: new FormControl('', Validators.required),
      resource_name: new FormControl(''),
      stage_id: new FormControl('', Validators.required),
      stage_description: new FormControl(''),
      status_id: new FormControl('', Validators.required),
      status_description: new FormControl(''),
    });
    if (this.resourceId) {
      this.getRequirementList();
      this.getStatus();
      this.getStage();
    } else {
      this.toastService.errorToast(this.toastConstants.invalid_requirement_ID);
    }
  }

  setClose() {
    this.modalController.dismiss();
  }

  onSubmit(form: FormGroup) {
    if (form.valid) {
      this.addResource.emit(form.value);
      this.modalController.dismiss();
    } else {
      this.resourceform.markAllAsTouched();
    }
  }

  getRequirementList() {
    let requestRequirementId: resourceId = {
      requirementId: this.resourceId,
    };
    this.resourceRequirementService
      .getSigleRequirement(requestRequirementId)
      .subscribe((resource: Object) => {
        const resources = resource as resourceResponse;
        if (resources.data.resourceInfo.length == 0) {
          this.toastService.presentToast(
            this.toastConstants.resource_record_not_found
          );
        } else {
          this.resourceData = resources.data.resourceInfo;
          this.resourceDropDownData.data = resources.data.resourceInfo as [];
        }
      });
  }

  getStage() {
    this.commonService.getStage().subscribe((stage: stageResponse) => {
      this.StageData = stage.data.stageInfo;
      this.stageDropDownData.data = stage.data.stageInfo as [];
    });
  }

  getStatus() {
    this.commonService.getStatus().subscribe((status: statusResponse) => {
      this.StatusData = status.data.statusInfo;
      this.statusDropDownData.data = status.data.statusInfo as [];
    });
  }

  selectedResourceValue(id: number) {
    const resourceValue = this.resourceData.find(
      (resource: resourceData) => id == resource.resource_id
    );
    this.resourceform.patchValue({
      resource_name: resourceValue!.name,
    });
  }

  /**
   *
   * @param event contain dynamic value
   */

  resourceDropDownEvent(event: any) {
    this.resourceform.patchValue({
      resource_name: event.value.name,
      resource_id: event.value.resource_id,
    });
  }

  stageDropDownEvent(event: any) {
    this.resourceform.patchValue({
      stage_description: event.value.description,
      stage_id: event.value.stage_id,
    });
  }

  statusDropDownEvent(event: any) {
    this.resourceform.patchValue({
      status_description: event.value.description,
      status_id: event.value.status_id,
    });
  }

  selectedStageValue(id: number) {
    const stageValue = this.StageData.find(
      (stage: stageData) => id == stage.stage_id
    );
    this.resourceform.patchValue({
      stage_description: stageValue?.description,
    });
  }

  selectedStatusValue(id: number) {
    const statusValue = this.StatusData.find(
      (status: statusData) => id == status.status_id
    );
    this.resourceform.patchValue({
      status_description: statusValue?.description,
    });
  }
}
