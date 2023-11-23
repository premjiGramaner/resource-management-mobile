import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';
import { Common } from 'src/app/core/enum/static.enum';
import { DashboardHelperService } from '../../services/dashboard-helper.service';
import { ChartInstance, hiringChartData, hiringDataSet, hiringDetails, hiringFilterData } from '../../models/dashboard.model';
import { CookiesConstants } from 'src/app/core/constant/cookies.constants';
Chart.register(zoomPlugin);
@Component({
  selector: 'app-hiring-chart',
  templateUrl: './hiring-chart.component.html',
  styleUrls: ['./hiring-chart.component.scss'],
})
export class HiringChartComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() hiringChartData!: hiringChartData;
  @ViewChild('hiringCanvas') private hiringCanvas!: ElementRef;
  hiringChart!: ChartInstance;
  chartStyles = this.staticDataConstants.chartStyles;
  noDataAvailable = Common.empty_chart;
  constructor(private staticDataConstants: StaticDataConstants,
    private dashboardHelperService: DashboardHelperService,
    private cookiesConstants: CookiesConstants) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.applyCanvasStyles();
    this.initializeChart()
  }

  ngOnChanges() {

    if (this.hiringChartData.dataset.length != 0) {
      this.hiringChart.destroy();
      const filterType: string = this.hiringChartData.filterType.toUpperCase();
      if (filterType == Common.month.toUpperCase()) {
        this.hiringMonthData()
      }
      else if (filterType == Common.year.toUpperCase()) {
        this.hiringYearData(this.hiringChartData);
      }
      else if (filterType == Common.date.toUpperCase()) {
        this.hiringDayData(this.hiringChartData);
      }
    }
  }

  applyCanvasStyles() {
    const canvasElement = this.hiringCanvas.nativeElement;
    Object.assign(canvasElement.style, this.chartStyles);
  }

  hiringMonthData() {
    const uniqueOwners = this.hiringChartData.dataset.reduce(
      (acc: string[], info: hiringFilterData) => {
        info.data.forEach((entry: hiringDetails) => {
          if (!acc.includes(entry[this.hiringChartData.category as keyof hiringDetails] as string)) {
            acc.push(entry[this.hiringChartData.category as keyof hiringDetails] as string);
          }
        });
        return acc;
      },
      []
    );

    /**
     * hiringStage key is  created dynamically
     */
    const hiringStage: any = {};
    uniqueOwners.forEach((owner: string) => {
      hiringStage[owner] = new Array(this.hiringChartData.label.length).fill(0);
    });
    this.hiringChartData.dataset.forEach((info: hiringFilterData) => {
      const { Date, data } = info;
      data.forEach((entry: hiringDetails) => {
        const owner = entry[this.hiringChartData.category as keyof hiringDetails];
        const index = Date - this.hiringChartData.label.length;
        hiringStage[owner][index] = entry.Count;
      });

    });
    const output: hiringDataSet[] = Object.entries(hiringStage).map(([owner, data]) => ({
      label: owner,
      data: data as string[],
      backgroundColor: this.dashboardHelperService.getRandomColor(),
      borderColor: this.dashboardHelperService.getRandomColor(),
      borderWidth: 1,
    }));
    this.initializeChart(output);
  }

  hiringYearData(hiringInfo: hiringChartData) {
    const transformedData: { [key: string]: number[] } = {};
    for (const clientInfo of hiringInfo.dataset) {
      for (const dataObj of clientInfo.data) {
        const label = dataObj[this.hiringChartData.category as keyof hiringDetails];
        const year = Number(clientInfo.Date);
        const count = dataObj.Count;
        if (!transformedData[label]) {
          transformedData[label] = Array(5).fill(0);
        }
        const index = Number(hiringInfo.label[0]) - year;
        transformedData[label][index] += count;
      }
    }
    const outputData: hiringDataSet[] = Object.entries(transformedData).map(
      ([label, data]) => ({
        label: label,
        data: data,
        backgroundColor: this.dashboardHelperService.getRandomColor(),
        borderColor: this.dashboardHelperService.getRandomColor(),
        borderWidth: 1,
      })
    );
    this.initializeChart(outputData);
  }

  hiringDayData(hiringInfo: hiringChartData) {
    const transformedData: { [key: string]: number[] } = {};
    for (const clientInfo of hiringInfo.dataset) {
      for (const dataObj of clientInfo.data) {
        const label = dataObj[this.hiringChartData.category as keyof hiringDetails];
        transformedData[label] = Array(30).fill(0);
      }
    }
    for (const clientInfo of hiringInfo.dataset) {
      const givenDate = new Date(clientInfo.Date);
      for (const dataObj of clientInfo.data) {
        const label = dataObj[this.hiringChartData.category as keyof hiringDetails];
        const count = dataObj.Count;
        const dataDate = new Date(clientInfo.Date);
        if (!isNaN(dataDate.getTime())) {
          const index = this.dashboardHelperService.getDayDifference(givenDate, dataDate);
          if (index >= 0 && index < 5) {
            transformedData[label][index] += count;
          }
        }
      }
    }
    const outputData: hiringDataSet[] = Object.entries(transformedData).map(([label, data]) => ({
      label: label,
      data: data,
      backgroundColor: this.dashboardHelperService.getRandomColor(),
      borderColor: this.dashboardHelperService.getRandomColor(),
      borderWidth: 1,
    }));
    this.initializeChart(outputData);
  }
  initializeChart(data?: hiringDataSet[]) {
    data = data as hiringDataSet[];
    this.hiringChart = new Chart(this.hiringCanvas.nativeElement, {
      type: Common.bar,
      data: {
        labels: this.hiringChartData.label,
        datasets: data,
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: Common.hiring_chart,
          },
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: Common.mode,
            },
          }
        },
        responsive: true,
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      },
    });
  }
}
