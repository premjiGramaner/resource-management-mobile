import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-requirement',
  templateUrl: './view-requirement.component.html',
  styleUrls: ['./view-requirement.component.scss'],
})
export class ViewRequirementComponent implements OnInit {
  @Input() viewData: any;
  constructor() { }

  ngOnInit() {
    this.arrangeData(this.viewData);
  }

  arrangeData(data: any) {
    for (var val of data.skills) {
      this.skillObj(val);
    }
    for (var val of data.partner) {
      this.partnerObj(val);
    }
  }
  skillObj(skill: any) {
    Object.assign(skill, { description: skill.skill.description })
  }

  partnerObj(partner: any) {
    Object.assign(partner, { name: partner.name })
  }
}
