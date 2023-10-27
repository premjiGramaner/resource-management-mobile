import { Component, Input, OnInit } from '@angular/core';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';

@Component({
  selector: 'app-view-resource',
  templateUrl: './view-resource.component.html',
  styleUrls: ['./view-resource.component.scss'],
})
export class ViewResourceComponent  implements OnInit {
  @Input() viewData: any;
  rating = this.staticData?.rating;

  constructor(private staticData :StaticDataConstants) { }

  ngOnInit() {
    this.arrangeSkillData(this.viewData?.skills);
  }

  arrangeSkillData(skills:any){
    for (var val of skills) {
      this.skillObj(val);
    }
  }
  skillObj(skill:any){
    
      Object.assign(skill, { description: skill?.skill?.description })
    
    const ind = this.rating?.findIndex((el: any) => el.id === parseInt(skill?.rating))
    if (ind >= 0) {
      Object.assign(skill, { ratingName: this.rating[ind]?.name })
    }

  }

}
