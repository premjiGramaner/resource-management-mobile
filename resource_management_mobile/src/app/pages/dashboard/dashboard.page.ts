import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';
import { Common } from 'src/app/core/enum/static.enum';
import { Chart, ChartType, registerables } from 'chart.js';
import { DashboardService } from './services/dashboard.service';
import { clientChartData } from './models/dashboard.model';
Chart.register(...registerables);
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {
  filterCategory = this.StaticDataConstants.dashboard_select_options;
  selectedFilterValue: Object = '' + this.filterCategory[0].id;
  filterType = Common.date.toUpperCase();
  barChart !: Object;

  clientChartData: clientChartData = {
    dataset: [],
    label: []
  }
  data = {
    "dashboardClientInfo": [
      {
        "Date": 5,
        "data": [
          {
            "Count": 1,
            "owner": {
              "name": "Local Test Admin"
            }
          }
        ]
      },
      {
        "Date": 7,
        "data": [
          {
            "Count": 20,
            "owner": {
              "name": "Local Test Admin"
            }
          },
          {
            "Count": 2,
            "owner": {
              "name": "alpha"
            }
          },
          {
            "Count": 1,
            "owner": {
              "name": "alpha123"
            }
          }
        ]
      },
      {
        "Date": 8,
        "data": [
          {
            "Count": 4,
            "owner": {
              "name": "Local Test Admin"
            }
          },
          {
            "Count": 6,
            "owner": {
              "name": "alpha"
            }
          },
          {
            "Count": 3,
            "owner": {
              "name": "alpha123"
            }
          }
        ]
      },
      {
        "Date": 9,
        "data": [
          {
            "Count": 8,
            "owner": {
              "name": "Local Test Admin"
            }
          },
          {
            "Count": 1,
            "owner": {
              "name": "alpha"
            }
          }
        ]
      }
    ]
  }
  @ViewChild('barCanvas') private barCanvas!: ElementRef;
  constructor(
    private StaticDataConstants: StaticDataConstants,
    private getDashboardAPI: DashboardService) { }

  ngOnInit() {

  }
  async selectDateType(value: number) {
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
    /**
     * Month based filter
     */
    if (this.filterType.toUpperCase() == Common.month.toUpperCase()) {
      let dateRange = await this.getLastSixMonthsRange()
      let monthReq = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        type: this.filterType
      }
      this.dashboarAPICalls(monthReq);

    }

  }
  dashboarAPICalls(req: any) {
    this.getDashboardAPI.getDashboardClient(req).subscribe(async (res) => {
      console.log(res);
      this.clientChartData = {
        label: await this.getLastSixMonths(),
        dataset: await res.data.dashboardClientInfo
      }

    })
  }
  getLastSixMonths() {
    let today = new Date(); // Get the current date
    let months = []; // Array to store the last six months

    for (let i = 5; i >= 0; i--) {
      let pastMonth = new Date(today);
      pastMonth.setMonth(pastMonth.getMonth() - i);
      months.push(pastMonth.toLocaleString('default', { month: 'long' }));
    }

    return months;
  }
  getLastSixMonthsRange() {
    let today = new Date(); // Get the current date
    let endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    let startDate = new Date(today.getFullYear(), today.getMonth() - 5, 1);
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate)
    };
  }

  getRandomColor() {
    return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.5)`;
  }
}
