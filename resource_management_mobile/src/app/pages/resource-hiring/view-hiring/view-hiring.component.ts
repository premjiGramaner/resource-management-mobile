import { Component, Input, OnInit } from '@angular/core';
import { HiringService } from '../service/hiring.service';
import { hiringData, hiringHistoryResponse, historyData } from '../model/hiring.model';

@Component({
  selector: 'app-view-hiring',
  templateUrl: './view-hiring.component.html',
  styleUrls: ['./view-hiring.component.scss'],
})
export class ViewHiringComponent implements OnInit {
  @Input() viewData: hiringData | undefined;
  items: historyData[] = [];
  constructor(private hiringService: HiringService) { }

  ngOnInit() {
    if (this.viewData)
      this.getHistoryData(this.viewData.hiring_tracker_id);
  }

  getHistoryData(id: number) {
    this.hiringService.getHiringHistoryData(id).subscribe((res:hiringHistoryResponse) => {
      this.items = [...this.items, ...res.data.HistoryInfo];
    })
  }

}
