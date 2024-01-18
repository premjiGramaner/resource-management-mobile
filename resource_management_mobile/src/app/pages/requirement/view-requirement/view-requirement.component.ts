import { Component, Input, OnInit } from '@angular/core';
import { partner, requiementData, skill } from '../models/requirement.model';
import { RequirementService } from '../services/requirement.service';

@Component({
  selector: 'app-view-requirement',
  templateUrl: './view-requirement.component.html',
  styleUrls: ['./view-requirement.component.scss'],
})
export class ViewRequirementComponent implements OnInit {
  @Input() viewData: requiementData | undefined;
  constructor(
    private requirementService: RequirementService
  ) { }

  ngOnInit() {
    if (this.viewData)
      this.arrangeData(this.viewData);
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
    Object.assign(skill, { description: skill?.description })
  }

  partnerObj(partner: partner) {
    Object.assign(partner, { name: partner?.name })
  }

  updateMarkAsComplete() {

    let resourceIds: number[] = []
    let updateMarkAsCompleteReq = {
      id: this.viewData?.requirement_id,
      resourceIds: resourceIds
    }
    const requirement_Id = this.viewData?.requirement_id;
    this.requirementService.resourceMatchedData(requirement_Id!).subscribe((res) => {
      res.data.resourceInfo.map((item: any) => {
        resourceIds.push(item.resource_id)
      })
      updateMarkAsCompleteReq['resourceIds'] = resourceIds;
      this.requirementService.markAsComplete(updateMarkAsCompleteReq).subscribe(res => {

      })
    })
    console.log(this.viewData, updateMarkAsCompleteReq)

  }
}
