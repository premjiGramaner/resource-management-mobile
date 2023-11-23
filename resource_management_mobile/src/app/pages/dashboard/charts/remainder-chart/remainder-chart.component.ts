import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { DashboardHelperService } from '../../services/dashboard-helper.service';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';
import { clientChartData, ChartInstance, requirementChartData, requirementDataSet, remainderChartData, ClientDataSet, requirementDetails, requirementFilterData } from '../../models/dashboard.model';
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Common } from 'src/app/core/enum/static.enum';
Chart.register(zoomPlugin);
@Component({
  selector: 'app-remainder-chart',
  templateUrl: './remainder-chart.component.html',
  styleUrls: ['./remainder-chart.component.scss'],
})
export class RemainderChartComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() remainderChartData!: remainderChartData;
  remainderChart!: ChartInstance;
  @ViewChild('remainderCanvas') private remainderCanvas!: ElementRef;
  chartStyles = this.staticDataConstants.chartStyles;
  noDataAvailable = Common.empty_chart;
  constructor(
    private staticDataConstants: StaticDataConstants,
    private dashboardHelperService: DashboardHelperService) { }

  ngOnInit() {

  }
  ngAfterViewInit() {
    this.applyCanvasStyles();
    this.initializeChart();
  }

  ngOnChanges() {
    if (this.remainderChartData.dataset.length != 0) {
      this.remainderChart.destroy();
      const filterType: string = this.remainderChartData.filterType.toUpperCase();
      if (filterType == Common.month.toUpperCase()) {
        this.remainderMonthData();
      } else if (filterType == Common.year.toUpperCase()) {
        this.remainderYearData(this.remainderChartData);
      }
      else if (filterType == Common.date.toUpperCase()) {

        this.remainderDayData(this.remainderChartData)
      }
    }
  }
  remainderMonthData() {
    const uniqueOwners = this.remainderChartData.dataset.reduce(
      (acc: string[], info: requirementFilterData) => {
        info.data.forEach((entry: requirementDetails) => {
          if (!acc.includes(entry.hiring_stage)) {
            acc.push(entry.hiring_stage);
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
      hiringStage[owner] = new Array(this.remainderChartData.label.length).fill(0);
    });
    this.remainderChartData.dataset.forEach((info: requirementFilterData) => {
      const { Date, data } = info;
      data.forEach((entry: requirementDetails) => {
        const owner = entry.hiring_stage;
        const index = Date - this.remainderChartData.label.length;
        hiringStage[owner][index] = entry.Count;
      });
    });
    const output: ClientDataSet[] = Object.entries(hiringStage).map(([owner, data]) => ({
      label: owner,
      data: data as string[],
      backgroundColor: this.dashboardHelperService.getRandomColor(),
      borderColor: this.dashboardHelperService.getRandomColor(),
      borderWidth: 1,
    }));
    this.initializeChart(output);
  }
  remainderYearData(requirementInfo: requirementChartData) {
    const transformedData: { [key: string]: number[] } = {};
    for (const clientInfo of requirementInfo.dataset) {
      for (const dataObj of clientInfo.data) {
        const label = dataObj.hiring_stage;
        const year = Number(clientInfo.Date);
        const count = dataObj.Count;
        if (!transformedData[label]) {
          transformedData[label] = Array(5).fill(0);
        }
        const index = Number(requirementInfo.label[0]) - year;
        transformedData[label][index] += count;
      }
    }
    const outputData: requirementDataSet[] = Object.entries(transformedData).map(
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
  remainderDayData(requirementInfo: requirementChartData) {
    const transformedData: { [key: string]: number[] } = {};
    for (const clientInfo of requirementInfo.dataset) {
      for (const dataObj of clientInfo.data) {
        const label = dataObj.hiring_stage;
        transformedData[label] = Array(30).fill(0);
      }
    }
    for (const clientInfo of requirementInfo.dataset) {
      const givenDate = new Date(clientInfo.Date);
      for (const dataObj of clientInfo.data) {
        const label = dataObj.hiring_stage;
        const count = dataObj.Count;
        const dataDate = new Date(clientInfo.Date);
        if (!isNaN(dataDate.getTime())) {
          const index = this.getDayDifference(givenDate, dataDate);
          if (index >= 0 && index < 5) {
            transformedData[label][index] += count;
          }
        }
      }
    }
    const outputData: ClientDataSet[] = Object.entries(transformedData).map(([label, data]) => ({
      label: label,
      data: data,
      backgroundColor: this.dashboardHelperService.getRandomColor(),
      borderColor: this.dashboardHelperService.getRandomColor(),
      borderWidth: 1,
    }));
    this.initializeChart(outputData);
  }
  getDayDifference(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
    return diffDays;
  }
  applyCanvasStyles() {
    const canvasElement = this.remainderCanvas.nativeElement;
    Object.assign(canvasElement.style, this.chartStyles);
  }
  initializeChart(data?: requirementDataSet[]) {
    data = data as requirementDataSet[]
    this.remainderChart = new Chart(this.remainderCanvas.nativeElement, {
      type: Common.bar,
      data: {
        labels: this.remainderChartData.label,
        datasets: data,
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: Common.remainder_chart,
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
          },

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
