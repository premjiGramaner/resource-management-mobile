import { Component, OnInit } from '@angular/core';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';
import { Common } from 'src/app/core/enum/static.enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {
  filterCategory = this.StaticDataConstants.dashboard_select_options;
  selectedFilterValue: Object = '' + this.filterCategory[0].id;
  filterType = Common.date.toUpperCase();
  constructor(private StaticDataConstants: StaticDataConstants) { }

  ngOnInit() {
  }

  selectDateType(value: number) {
    switch (Number(value)) {
      case 1:
        this.filterType = Common.date.toUpperCase();
        break;
      case 2:
        this.filterType = Common.month.toUpperCase();
        break;
      case 3:
        this.filterType = Common.year.toUpperCase();
        break;
      default:
        this.filterType = Common.date.toUpperCase();
    }
  }
}
