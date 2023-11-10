import { Component, Input, OnInit } from '@angular/core';
import { partner, requiementData, skill } from '../models/requirement.model';

@Component({
  selector: 'app-view-requirement',
  templateUrl: './view-requirement.component.html',
  styleUrls: ['./view-requirement.component.scss'],
})
export class ViewRequirementComponent implements OnInit {
  @Input() viewData: requiementData | undefined;
  constructor() { }

  ngOnInit() {
    if(this.viewData)
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
}
