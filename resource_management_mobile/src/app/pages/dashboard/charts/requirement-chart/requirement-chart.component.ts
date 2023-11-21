import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ChartInstance, ClientDataSet, requirementChartData, requirementDataSet, requirementDetails, requirementFilterData } from '../../models/dashboard.model';
import { Common } from 'src/app/core/enum/static.enum';
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';
import { DashboardHelperService } from '../../services/dashboard-helper.service';
Chart.register(zoomPlugin);
@Component({
  selector: 'app-requirement-chart',
  templateUrl: './requirement-chart.component.html',
  styleUrls: ['./requirement-chart.component.scss'],
})
export class RequirementChartComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() requirementChartData!: requirementChartData;
  requirementChart!: ChartInstance;
  @ViewChild('requirementCanvas') private requirementCanvas!: ElementRef;
  chartStyles = this.staticDataConstants.chartStyles;
  noDataAvailable = Common.empty_chart;

  constructor(
    private staticDataConstants: StaticDataConstants,
    private dashboardHelperService: DashboardHelperService) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.applyCanvasStyles();
    this.initializeChart();
  }

  ngOnChanges() {
    if (this.requirementChartData.dataset.length != 0) {
      this.requirementChart.destroy();
      const filterType: string = this.requirementChartData.filterType.toUpperCase();
      if (filterType == Common.month.toUpperCase()) {
        this.requirementMonthData()
      } else if (filterType == Common.year.toUpperCase()) {
        this.requirementYearData(this.requirementChartData);
      }
      else if (filterType == Common.date.toUpperCase()) {

        this.requirementDayData(this.requirementChartData);
      }
    }
  }

  requirementMonthData() {
    const uniqueOwners = this.requirementChartData.dataset.reduce(
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
      hiringStage[owner] = new Array(this.requirementChartData.label.length).fill(0);
    });
    this.requirementChartData.dataset.forEach((info: requirementFilterData) => {
      const { Date, data } = info;
      data.forEach((entry: requirementDetails) => {
        const owner = entry.hiring_stage;
        const index = Date - this.requirementChartData.label.length;
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

  requirementYearData(requirementInfo: requirementChartData) {
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
  requirementDayData(requirementInfo: any) {
    console.log('requirementInfo', requirementInfo);
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
  initializeChart(data?: requirementDataSet[]) {
    data = data as requirementDataSet[]
    this.requirementChart = new Chart(this.requirementCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.requirementChartData.label,
        datasets: data,
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Requirement chart',
          },
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: 'xy',
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

  applyCanvasStyles() {
    const canvasElement = this.requirementCanvas.nativeElement;
    Object.assign(canvasElement.style, this.chartStyles);
  }
}
