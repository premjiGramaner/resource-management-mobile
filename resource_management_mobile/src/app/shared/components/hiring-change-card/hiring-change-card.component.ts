import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';
import { CommonService } from '../../services/common.service';
import { statusData, statusResponse } from '../../models/common.model';
import { hiringData } from 'src/app/pages/resource-hiring/model/hiring.model';

@Component({
  selector: 'app-hiring-change-card',
  templateUrl: './hiring-change-card.component.html',
  styleUrls: ['./hiring-change-card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class HiringChangeCardComponent  implements OnInit {
  @Input() hiringData: hiringData | undefined;

  statusList:statusData[]=[];
  hiringStageList= this.staticData.hiring_stage;
  hiringStatusList=this.staticData.hiring_status;

  addform!: FormGroup;
  @Output() changeStatus = new EventEmitter();
  @Output() closeStatus = new EventEmitter();

  constructor(private modalController: ModalController,
    private commonService:CommonService,
    private staticData: StaticDataConstants) { }

  ngOnInit() {
    this.getStatusList();
    this.addform = new FormGroup({
      hiring_tracker_id: new FormControl(''+this.hiringData?.hiring_tracker_id,Validators.required),
      hiring_stage: new FormControl(this.hiringData?.hiring_stage,Validators.required),
      hiring_status: new FormControl(this.hiringData?.hiring_status,Validators.required),
      comments: new FormControl('',Validators.required),
      Status_status_id: new FormControl(''+this.hiringData?.Status_status_id,Validators.required)
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
}
