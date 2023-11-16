import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';
import { Common } from 'src/app/core/enum/static.enum';
import { Chart, ChartType, registerables } from 'chart.js';
import { DashboardService } from './services/dashboard.service';
import { PostClientChart, clientChartData } from './models/dashboard.model';
import { dashboardClientResponse } from './models/dashboard.API.model';
Chart.register(...registerables);
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  filterCategory = this.StaticDataConstants.dashboard_select_options;
  selectedFilterValue: Object = '' + this.filterCategory[0].id;
  filterType = Common.date.toUpperCase();
  barChart!: Object;

  clientChartData: clientChartData = {
    dataset: [],
    label: [],
    filterType: Common.date.toUpperCase(),
  };

  constructor(
    private StaticDataConstants: StaticDataConstants,
    private getDashboardAPI: DashboardService
  ) { }

  ngOnInit() {
    this.defaultAllDashboardCall();
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
      let dateRange = await this.getLastSixMonthsRange();
      let monthReq: PostClientChart = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        type: this.filterType,
      };
      this.getDashboardClient(monthReq);
    } else if (this.filterType.toUpperCase() == Common.year.toUpperCase()) {
      let yearRange = await this.getLastFiveYearsRange();
      let yearReq = {
        startDate: yearRange.startDate,
        endDate: yearRange.endDate,
        type: this.filterType,
      };
      this.getDashboardClient(yearReq);
    } else if (this.filterType.toUpperCase() == Common.date.toUpperCase()) {
      let dateRange = await this.getLast30DaysDateRange();
      let dateReq = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        type: this.filterType,
      };
      this.getDashboardClient(dateReq);
    }
  }

  getDashboardClient(req: PostClientChart) {
    this.getDashboardAPI.getDashboardClient(req).subscribe(async (res: dashboardClientResponse) => {
      if (this.filterType.toUpperCase() == Common.month.toUpperCase()) {
        this.clientChartData = {
          filterType: this.filterType,
          label: await this.getLastSixMonths(),
          dataset: await res.data.dashboardClientInfo,
        };
      } else if (this.filterType.toUpperCase() == Common.year.toUpperCase()) {
        this.clientChartData = {
          filterType: this.filterType,
          label: await this.getLastFiveYear(),
          dataset: await res.data.dashboardClientInfo,
        };
      } else if (this.filterType.toUpperCase() == Common.date.toUpperCase()) {
        this.clientChartData = {
          filterType: this.filterType,
          label: await this.getLast30DaysFormattedDates(),
          dataset: await res.data.dashboardClientInfo,
        };
      }
    });
  }
  getLast30DaysFormattedDates() {
    const dates = [];
    const today = new Date();
    for (let i = 30; i >= 0; i--) {
      // for (let i = 10; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const formattedDate = `${day}/${month}`;
      dates.unshift(formattedDate);
    }
    return dates;
  }
  defaultAllDashboardCall() {
    let dateRange = this.getLast30DaysDateRange();
    let dateReq = {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      type: this.filterType,
    };
    this.getDashboardClient(dateReq);
  }
  getLastSixMonths() {
    let today = new Date();
    let months = [];
    for (let i = 5; i >= 0; i--) {
      let pastMonth = new Date(today);
      pastMonth.setMonth(pastMonth.getMonth() - i);
      months.push(pastMonth.toLocaleString('default', { month: 'long' }));
    }

    return months;
  }
  getLastFiveYear() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const lastFiveYears = [];
    for (let i = 0; i < 5; i++) {
      const year = (currentYear - i).toString();
      lastFiveYears.push(year);
    }
    return lastFiveYears;
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
      endDate: formatDate(endDate),
    };
  }
  getLastFiveYearsRange() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const lastFiveYearsStartDate = new Date(
      currentYear - 5,
      today.getMonth(),
      today.getDate()
    );
    const lastFiveYearsEndDate = new Date(
      currentYear,
      today.getMonth(),
      today.getDate()
    );
    // Format dates in YYYY-MM-DD
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    return {
      startDate: formatDate(lastFiveYearsStartDate),
      endDate: formatDate(lastFiveYearsEndDate),
    };
  }
  getLast30DaysDateRange() {
    const today = new Date();
    const endDate = today.toISOString().split('T')[0];
    const startDate = new Date();
    startDate.setDate(today.getDate() - 29);
    const startDateFormatted = startDate.toISOString().split('T')[0];
    return { startDate: startDateFormatted, endDate };
  }
  getRandomColor() {
    return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)}, 0.5)`;
  }
}
