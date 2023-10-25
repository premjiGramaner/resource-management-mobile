import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-requirement',
  templateUrl: './view-requirement.component.html',
  styleUrls: ['./view-requirement.component.scss'],
})
export class ViewRequirementComponent  implements OnInit {
  @Input() viewData: any;
  constructor() { }

  ngOnInit() {}

}
