import { Component, Input, OnInit } from '@angular/core';
import { StaticDataConstants, ratingData } from 'src/app/core/constant/staticData.constants';
import { resourceData, skill } from '../models/resource.model';

@Component({
  selector: 'app-view-resource',
  templateUrl: './view-resource.component.html',
  styleUrls: ['./view-resource.component.scss'],
})
export class ViewResourceComponent  implements OnInit {
  @Input() viewData: resourceData | undefined;
  rating: ratingData[] = this.staticData?.rating;

  constructor(private staticData :StaticDataConstants) { }

  ngOnInit() {
    if(this.viewData)
    this.arrangeSkillData(this.viewData?.skills);
  }

  arrangeSkillData(skills:skill[]){
    for (var val of skills) {
      this.skillObj(val);
    }
  }
  skillObj(skill:skill){
    
      Object.assign(skill, { description: skill?.skill?.description })
    
    const ind = this.rating?.findIndex((el: ratingData) => el.id === skill?.rating)
    if (ind >= 0) {
      Object.assign(skill, { ratingName: this.rating[ind]?.name })
    }

  }

}
