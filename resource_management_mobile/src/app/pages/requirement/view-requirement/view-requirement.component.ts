import { Component, Input, OnInit } from '@angular/core';
import {
  multiResource,
  multiResourceResponse,
  partner,
  requiementData,
  skill,
} from '../models/requirement.model';
import { RequirementService } from '../services/requirement.service';
import { ToastService } from 'src/app/core/toast/toast.service';
import { ToastConstants } from 'src/app/core/constant/toast.message.constant';

@Component({
  selector: 'app-view-requirement',
  templateUrl: './view-requirement.component.html',
  styleUrls: ['./view-requirement.component.scss'],
})
export class ViewRequirementComponent implements OnInit {
  @Input() viewData: requiementData | undefined;
  constructor(
    private requirementService: RequirementService,
    private toastService: ToastService,
    private toastConstants: ToastConstants
  ) { }

  ngOnInit() {
    if (this.viewData) this.arrangeData(this.viewData);
  }

  arrangeData(data: requiementData) {
    for (var val of data?.skills) {
      this.skillObj(val);
    }
    for (var value of data?.partner) {
      this.partnerObj(value);
    }
  }
  skillObj(skill: skill) {
    Object.assign(skill, { description: skill?.description });
  }

  partnerObj(partner: partner) {
    Object.assign(partner, { name: partner?.name });
  }

  updateMarkAsComplete() {
    let multiResourceReq: multiResource = {
      Requirement_requirement_id: 2,
      resourceIds: [],
      Status_status_id: 4,
    };
    this.requirementService
      .updateMultiResourceRquirementById(multiResourceReq)
      .subscribe((res: multiResourceResponse) => {
        if (res.statusCode == 200) {
          this.toastService.presentToast(res.message);
        } else {
          this.toastService.errorToast(this.toastConstants.try_again);
        }
      });
  }
}
