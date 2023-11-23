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
import { PostCategoryChart, PostClientChart, PostRemainderChart, clientChartData, hiringChartData, remainderChartData, remainderDataSet, requirementChartData, resourceChartData } from './models/dashboard.model';
import { dashboardClientResponse, dashboardRequirementResponse } from './models/dashboard.API.model';
import { CookiesConstants } from 'src/app/core/constant/cookies.constants';
import { SecurityService } from 'src/app/shared/helpers/security.service';
Chart.register(...registerables);
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  filterCategory = this.StaticDataConstants.dashboard_select_options;
  selectedFilterValue: Object = '' + this.filterCategory[1].id;
  filterType = Common.month.toUpperCase();
  barChart!: Object;
  isCategoryChecked: boolean = true;
  isCategoryResourceChecked: boolean = true;
  categoryType: string = this.cookiesConstants.hiring_stage;
  categoryResourceType: string = this.cookiesConstants.hiring_stage;
  globalMonthRange: any;
  globalYearRange: any;
  globalDayRange: any;
  globalResourceDayRange: any;
  globalResourceMonthRange: any;
  globalResourceYearRange: any;
  clientChartData: clientChartData = {
    dataset: [],
    label: [],
    filterType: Common.month.toUpperCase(),
  };

  requirementChartData: requirementChartData = {
    dataset: [],
    label: [],
    filterType: Common.month.toUpperCase(),
  };

  resourceChartData: resourceChartData = {
    dataset: [],
    label: [],
    filterType: Common.month.toUpperCase(),
  };

  remainderChartData: remainderChartData = {
    dataset: [],
    label: [],
    filterType: Common.month.toUpperCase(),
  };

  hiringChartData: hiringChartData = {
    dataset: [],
    label: [],
    filterType: Common.month.toUpperCase(),
    category: this.cookiesConstants.hiring_stage
  }

  user_id!: number;

  constructor(
    private StaticDataConstants: StaticDataConstants,
    private getDashboardAPI: DashboardService,
    private security: SecurityService,
    private cookiesConstants: CookiesConstants
  ) { }

  ngOnInit() {
    this.user_id = this.security.getItem(this.cookiesConstants.user);
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
        this.filterType = Common.month.toUpperCase();
    }
    /**
     * Month based filter
     */
    if (this.filterType.toUpperCase() == Common.month.toUpperCase()) {
      this.globalMonthRange = await this.getLastSixMonthsRange();
      let dateRange = await this.globalMonthRange;
      let monthReq: PostClientChart = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        type: this.filterType,
      };
      let monthRemainderReq: PostRemainderChart = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        type: this.filterType,
        userId: this.user_id
      };
      this.getDashboardClient(monthReq);
      this.getDashboardRequirementData(monthReq);
      this.getDashboardResourceData(monthReq);
      this.getDashboardRemainderData(monthRemainderReq);
      this.getDashboardHiring(this.hiringAPIRequest(this.globalMonthRange as PostCategoryChart));
    }
    /**
     * Year based filter
     */
    else if (this.filterType.toUpperCase() == Common.year.toUpperCase()) {
      this.globalYearRange = await this.getLastFiveYearsRange();
      let yearRange = await this.getLastFiveYearsRange();
      let yearReq = {
        startDate: yearRange.startDate,
        endDate: yearRange.endDate,
        type: this.filterType,
      };
      let monthRemainderReq: PostRemainderChart = {
        startDate: yearRange.startDate,
        endDate: yearRange.endDate,
        type: this.filterType,
        userId: this.user_id
      };
      this.getDashboardClient(yearReq);
      this.getDashboardRequirementData(yearReq);
      this.getDashboardResourceData(yearReq);
      this.getDashboardRemainderData(monthRemainderReq);
      this.getDashboardHiring(this.hiringAPIRequest(this.globalYearRange as PostCategoryChart));
    }
    /**
    * Date based filter
    */
    else if (this.filterType.toUpperCase() == Common.date.toUpperCase()) {
      this.globalDayRange = await this.getLast30DaysDateRange();
      let dateRange = this.globalDayRange;
      let dateReq = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        type: this.filterType,
      };
      let dateRemainderReq: PostRemainderChart = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        type: this.filterType,
        userId: this.user_id
      };
      this.getDashboardClient(dateReq);
      this.getDashboardRequirementData(dateReq);
      this.getDashboardResourceData(dateReq);
      this.getDashboardRemainderData(dateRemainderReq);
      this.getDashboardHiring(this.hiringAPIRequest(this.globalDayRange as PostCategoryChart));
    }
  }

  /**API Calls */
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

  getDashboardRequirementData(req: PostClientChart) {
    this.getDashboardAPI.getDashboardRequirement(req).subscribe(async (res: dashboardRequirementResponse) => {
      if (this.filterType.toUpperCase() == Common.month.toUpperCase()) {
        this.requirementChartData = {
          filterType: this.filterType,
          label: await this.getLastSixMonths(),
          dataset: await res.data.dashboardReminderInfo,
        };
      }
      else if (this.filterType.toUpperCase() == Common.year.toUpperCase()) {
        this.requirementChartData = {
          filterType: this.filterType,
          label: await this.getLastFiveYear(),
          dataset: await res.data.dashboardReminderInfo,
        };
      }
      else if (this.filterType.toUpperCase() == Common.date.toUpperCase()) {
        this.requirementChartData = {
          filterType: this.filterType,
          label: await this.getLast30DaysFormattedDates(),
          dataset: await res.data.dashboardReminderInfo,
        };
      }
    });
  }

  getDashboardResourceData(req: PostClientChart) {
    this.getDashboardAPI.getDashboardResource(req).subscribe(async (res: any) => {
      if (this.filterType.toUpperCase() == Common.month.toUpperCase()) {
        this.resourceChartData = {
          filterType: this.filterType,
          label: await this.getLastSixMonths(),
          dataset: await res.data.dashboardResourceInfo,
        };
      }
      else if (this.filterType.toUpperCase() == Common.year.toUpperCase()) {
        this.resourceChartData = {
          filterType: this.filterType,
          label: await this.getLastFiveYear(),
          dataset: await res.data.dashboardResourceInfo,
        };
      }
      else if (this.filterType.toUpperCase() == Common.date.toUpperCase()) {
        this.resourceChartData = {
          filterType: this.filterType,
          label: await this.getLast30DaysFormattedDates(),
          dataset: await res.data.dashboardResourceInfo,
        };
      }
    });
  }

  getDashboardRemainderData(req: PostRemainderChart) {
    this.getDashboardAPI.getDashboardRemainder(req).subscribe(async (res: dashboardRequirementResponse) => {
      if (this.filterType.toUpperCase() == Common.month.toUpperCase()) {
        this.remainderChartData = {
          filterType: this.filterType,
          label: await this.getLastSixMonths(),
          dataset: await res.data.dashboardReminderInfo,
        };
      }
      else if (this.filterType.toUpperCase() == Common.year.toUpperCase()) {
        this.remainderChartData = {
          filterType: this.filterType,
          label: await this.getLastFiveYear(),
          dataset: await res.data.dashboardReminderInfo,
        };
      }
      else if (this.filterType.toUpperCase() == Common.date.toUpperCase()) {
        this.remainderChartData = {
          filterType: this.filterType,
          label: await this.getLast30DaysFormattedDates(),
          dataset: await res.data.dashboardReminderInfo,
        };
      }
    });
  }

  getDashboardHiring(req: PostCategoryChart) {
    this.getDashboardAPI.getDashboardHiring(req).subscribe(async (res: any) => {
      if (this.filterType.toUpperCase() == Common.month.toUpperCase()) {
        this.hiringChartData = {
          filterType: this.filterType,
          label: await this.getLastSixMonths(),
          dataset: await res.data.dashboardHiringInfo,
          category: await this.categoryType
        };
      }
      else if (this.filterType.toUpperCase() == Common.year.toUpperCase()) {
        this.hiringChartData = {
          filterType: this.filterType,
          label: await this.getLastFiveYear(),
          dataset: await res.data.dashboardHiringInfo,
          category: await this.categoryType
        };
      }
      else if (this.filterType.toUpperCase() == Common.date.toUpperCase()) {
        this.hiringChartData = {
          filterType: this.filterType,
          label: await this.getLast30DaysFormattedDates(),
          dataset: await res.data.dashboardHiringInfo,
          category: await this.categoryType
        };
      }
    });
  }
  getDashboardResourceRequirement(req: PostCategoryChart) {
    this.getDashboardAPI.getDashboardResourceRequirement(req).subscribe(async (res: any) => {

    })
  }
  /**
   * 
   * Helper  functions
   */
  categoryChanged() {
    this.categoryType = this.isCategoryChecked ? this.cookiesConstants.hiring_status : this.cookiesConstants.hiring_stage;
    switch (this.filterType.toUpperCase()) {
      case Common.date.toUpperCase():
        this.getDashboardHiring(this.hiringAPIRequest(this.globalDayRange))
        break;
      case Common.month.toUpperCase():
        this.getDashboardHiring(this.hiringAPIRequest(this.globalMonthRange))
        break;
      case Common.year.toUpperCase():
        this.getDashboardHiring(this.hiringAPIRequest(this.globalYearRange))
        break;
      default:
        this.getDashboardHiring(this.hiringAPIRequest(this.globalDayRange))
    }
  }

  categoryResourceChanged() {
    this.categoryResourceType = this.isCategoryResourceChecked ? this.cookiesConstants.status : this.cookiesConstants.stage;
    // switch (this.filterType.toUpperCase()) {
    //   case Common.date.toUpperCase():
    //     this.getDashboardResourceRequirement(this.resourceAPIRequest(this.globalResourceDayRange))
    //     break;
    //   case Common.month.toUpperCase():
    //     this.getDashboardResourceRequirement(this.resourceAPIRequest(this.globalResourceMonthRange))
    //     break;
    //   case Common.year.toUpperCase():
    //     this.getDashboardResourceRequirement(this.resourceAPIRequest(this.globalResourceYearRange))
    //     break;
    //   default:
    //     this.getDashboardResourceRequirement(this.resourceAPIRequest(this.globalResourceDayRange))
    // }
  }

  hiringAPIRequest(dateRange: PostCategoryChart) {
    return {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      type: this.filterType,
      category: this.categoryType
    }
  }
  resourceAPIRequest(dateRange: PostCategoryChart) {
    return {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      type: this.filterType,
      category: this.categoryResourceType
    }
  }

  getLast30DaysFormattedDates() {
    const dates = [];
    const today = new Date();
    for (let i = 30; i >= 1; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const formattedDate = `${day}/${month}`;
      dates.unshift(`${i}/${month}`);
    }
    return dates;
  }

  defaultAllDashboardCall() {
    this.globalMonthRange = this.getLastSixMonthsRange();
    let dateRange = this.globalMonthRange;
    let dateReq = {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      type: this.filterType,
    };
    let monthRemainderReq: PostRemainderChart = {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      type: this.filterType,
      userId: this.user_id
    };
    this.getDashboardClient(dateReq);
    this.getDashboardRequirementData(dateReq);
    this.getDashboardResourceData(dateReq);
    this.getDashboardRemainderData(monthRemainderReq);
    this.getDashboardHiring(this.hiringAPIRequest(this.globalMonthRange as PostCategoryChart));
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
}
