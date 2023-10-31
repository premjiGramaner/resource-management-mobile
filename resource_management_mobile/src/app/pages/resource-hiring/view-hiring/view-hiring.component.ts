import { Component, Input, OnInit } from '@angular/core';
import { HiringService } from '../service/hiring.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-view-hiring',
  templateUrl: './view-hiring.component.html',
  styleUrls: ['./view-hiring.component.scss'],
})
export class ViewHiringComponent  implements OnInit {
  @Input() viewData: any;
  items:any = [];
  constructor(private hiringService:HiringService) { }

  ngOnInit() {
    this.getHistoryData(this.viewData.hiring_tracker_id);
  }

  getHistoryData(id:number){
    this.hiringService.getHiringHistoryData(id).subscribe((res)=>{
      console.log(res);
      this.items = [...this.items, ...res.data.HistoryInfo];
    })
  }
  
}
