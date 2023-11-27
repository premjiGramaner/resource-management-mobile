import { Component, Input, OnInit } from '@angular/core';
import { adminRequirementData } from 'src/app/pages/resource-requirement/models/resource-requirement-model';

@Component({
  selector: 'app-view-requirement-status',
  templateUrl: './view-requirement-status.component.html',
  styleUrls: ['./view-requirement-status.component.scss'],
})
export class ViewRequirementStatusComponent  implements OnInit {
  @Input() viewData: adminRequirementData | undefined;

  constructor() { }

  ngOnInit() {}

}
