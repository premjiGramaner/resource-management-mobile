import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonService } from '../../services/common.service';
import { stageData, stageResponse, statusData, statusResponse } from '../../models/common.model';
import { adminRequirementData } from 'src/app/pages/resource-requirement/models/resource-requirement-model';

@Component({
  selector: 'app-requirement-change-status',
  templateUrl: './requirement-change-status.component.html',
  styleUrls: ['./requirement-change-status.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class RequirementChangeStatusComponent  implements OnInit {

  @Input() requirementData: adminRequirementData | undefined;

  stageList:stageData[]=[];
  statusList:statusData[]=[];
  

  addform!: FormGroup;
  @Output() changeStatus = new EventEmitter();
  @Output() closeStatus = new EventEmitter();

  constructor(private modalController: ModalController,
    private commonService:CommonService) { }

  ngOnInit() {
    this.getStatusList();
    this.getStageList();
    this.addform = new FormGroup({
      Resource_requirement_id: new FormControl(''+this.requirementData?.Resource_requirement_id,Validators.required),
      Resource_resource_id: new FormControl(''+this.requirementData?.Resource_resource_id,Validators.required),
      Status_status_id: new FormControl(''+this.requirementData?.Status_status_id,Validators.required),
      Stage_stage_id: new FormControl(''+this.requirementData?.Stage_stage_id,Validators.required),
    });
  }

  setClose() {
    this.modalController.dismiss();
    this.closeStatus.emit();
  }

  onSubmit(form:FormGroup){
    if(form.valid){
      this.changeStatus.emit(form.value);
      this.modalController.dismiss();
    } else {
      this.addform.markAllAsTouched();
    }
  }

  getStatusList(){
    this.commonService.getStatus().subscribe((res:statusResponse)=>{
      this.statusList = res.data.statusInfo;
    })
  }

  getStageList(){
    this.commonService.getStage().subscribe((res:stageResponse)=>{
      this.stageList = res.data.stageInfo;
    })
  }

}
