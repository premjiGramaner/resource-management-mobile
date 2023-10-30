import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';
import { ProfileService } from '../../profile/service/profile.service';
import { ResourceService } from '../../resource/service/resource.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Status } from 'src/app/core/enum/status.enum';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-hiring',
  templateUrl: './add-hiring.component.html',
  styleUrls: ['./add-hiring.component.scss'],
})
export class AddHiringComponent  implements OnInit {
  @Input() viewData: any;

  addform!: FormGroup;
  onSubmit: boolean = true;

  resourceList:any=[];
  userList:any =[];
  hiringStageList= this.staticData.hiring_stage;
  hiringStatusList=this.staticData.hiring_status;
  statusList:any=[];

  constructor(private commonService: CommonService,
    private resourceService: ResourceService,
    private userService: ProfileService,
    private modalController: ModalController,
    private staticData: StaticDataConstants) { }

  ngOnInit() {
    this.getResourceList();
    this.getUserList();
    if (this.viewData) {
      this.addform = new FormGroup({
        hiring_tracker_id: new FormControl(this.viewData.hiring_tracker_id, Validators.required),
        Resource_resource_id: new FormControl(''+this.viewData.Resource_resource_id, Validators.required),
        evaluated_by: new FormControl(''+this.viewData.evaluated_by, Validators.required),
        // Status_status_id: new FormControl(''+this.viewData.Status_status_id, Validators.required),
        evaluated_date: new FormControl(this.viewData.evaluated_date.replace(/\//g, '-'), Validators.required),
        // hiring_stage: new FormControl(this.viewData.hiring_stage, Validators.required),
        // hiring_status: new FormControl(this.viewData.hiring_status, Validators.required),
        comments: new FormControl(this.viewData.comments, Validators.required)
      });
    } else {
      this.getStatusList();
      this.addform = new FormGroup({
        Resource_resource_id: new FormControl('', Validators.required),
        evaluated_by: new FormControl('', Validators.required),
        Status_status_id: new FormControl('', Validators.required),
        evaluated_date: new FormControl('', Validators.required),
        hiring_stage: new FormControl('', Validators.required),
        hiring_status: new FormControl('', Validators.required),
        comments: new FormControl('', Validators.required)
      });
    }
  }

  getUserList() {
    this.userService.getUser().subscribe((res) => {
      this.userList = res.data.userInfo;
    });
  }

  getResourceList(){
    this.resourceService.getResourceAllData().subscribe((res)=>{
      this.resourceList = res.data.resourceInfo;
    })
  }

  getStatusList(){
    this.commonService.getStatus().subscribe((res)=>{
      this.statusList = res.data.statusInfo;
    })
  }

  isFormValid() {
    if (this.addform.status == Status.INVALID) {
      this.onSubmit = false;
      this.addform.markAllAsTouched();
      return false;
    }
    return this.addform.valid;
  }

  setClose() {
    this.modalController.dismiss();
  }
}
