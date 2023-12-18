import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';
import { Common } from 'src/app/core/enum/static.enum';
import { DashboardHelperService } from '../../services/dashboard-helper.service';
import {
  ChartInstance,
  resourceRequirementChartData,
  resourceRequirementDataSet,
  resourceRequirementDetails,
  resourceRequirementFilterData,
} from '../../models/dashboard.model';
import { CookiesConstants } from 'src/app/core/constant/cookies.constants';
Chart.register(zoomPlugin);
@Component({
  selector: 'app-resource-requirement-chart',
  templateUrl: './resource-requirement-chart.component.html',
  styleUrls: ['./resource-requirement-chart.component.scss'],
})
export class ResourceRequirementChartComponent
  implements OnInit, OnChanges, AfterViewInit {
  @Input() resourceRequirementChartData!: resourceRequirementChartData;
  @ViewChild('resourceRequirementCanvas')
  private resourceRequirementCanvas!: ElementRef;
  resourceChart!: ChartInstance;
  chartStyles = this.staticDataConstants.chartStyles;
  noDataAvailable = Common.empty_chart;
  constructor(
    private staticDataConstants: StaticDataConstants,
    private cookiesConstants: CookiesConstants,
    private dashboardHelperService: DashboardHelperService
  ) { }

  ngOnInit() { }
  ngAfterViewInit() {
    this.applyCanvasStyles();
    this.initializeChart();
  }
  ngOnChanges() {
    if (this.resourceRequirementChartData.dataset.length != 0) {
      this.resourceChart.destroy();
      const filterType: string =
        this.resourceRequirementChartData.filterType.toUpperCase();
      if (filterType == Common.month.toUpperCase()) {
        this.resourceRequirementMonthData();
      } else if (filterType == Common.year.toUpperCase()) {
        this.resourceRequirementYearData(this.resourceRequirementChartData);
      } else if (filterType == Common.date.toUpperCase()) {
        this.resourceRequirementDayData(this.resourceRequirementChartData);
      }
    }
  }

  resourceRequirementMonthData() {
    const uniqueOwners = this.resourceRequirementChartData.dataset.reduce(
      (acc: string[], info: resourceRequirementFilterData) => {
        info.data.forEach((entry: resourceRequirementDetails) => {
          if (
            this.resourceRequirementChartData.category ==
            this.cookiesConstants.stage
          ) {
            if (!acc.includes(entry.stage.description)) {
              acc.push(entry.stage.description);
            }
          } else {
            if (!acc.includes(entry.status.description)) {
              acc.push(entry.status.description);
            }
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
      hiringStage[owner] = new Array(
        this.resourceRequirementChartData.label.length
      ).fill(0);
    });
    this.resourceRequirementChartData.dataset.forEach(
      (info: resourceRequirementFilterData) => {
        const { Date, data } = info;
        data.forEach((entry: resourceRequirementDetails) => {
          let owner;
          if (
            this.resourceRequirementChartData.category ==
            this.cookiesConstants.stage
          ) {
            owner = entry.stage.description;
          } else {
            owner = entry.status.description;
          }

          const index = Date - this.resourceRequirementChartData.label.length;
          hiringStage[owner][index] = entry.Count;
        });
      }
    );
    const output: resourceRequirementDataSet[] = Object.entries(
      hiringStage
    ).map(([owner, data]) => ({
      label: owner,
      data: data as string[],
      backgroundColor: this.dashboardHelperService.getRandomColor(),
      borderColor: this.dashboardHelperService.getRandomColor(),
      borderWidth: 1,
    }));
    this.initializeChart(output);
  }

  resourceRequirementYearData(
    resourceRequirementInfo: resourceRequirementChartData
  ) {
    const transformedData: { [key: string]: number[] } = {};
    for (const clientInfo of resourceRequirementInfo.dataset) {
      for (const dataObj of clientInfo.data) {
        let label;
        if (
          this.resourceRequirementChartData.category ==
          this.cookiesConstants.stage
        ) {
          label = dataObj.stage.description;
        } else {
          label = dataObj.status.description;
        }
        const year = Number(clientInfo.Date);
        const count = dataObj.Count;
        if (!transformedData[label]) {
          transformedData[label] = Array(5).fill(0);
        }
        const index = Number(resourceRequirementInfo.label[0]) - year;
        transformedData[label][index] += count;
      }
    }
    const outputData: resourceRequirementDataSet[] = Object.entries(
      transformedData
    ).map(([label, data]) => ({
      label: label,
      data: data,
      backgroundColor: this.dashboardHelperService.getRandomColor(),
      borderColor: this.dashboardHelperService.getRandomColor(),
      borderWidth: 1,
    }));
    this.initializeChart(outputData);
  }

  resourceRequirementDayData(
    resourceRequirementInfo: resourceRequirementChartData
  ) {
    const transformedData: { [key: string]: number[] } = {};
    for (const clientInfo of resourceRequirementInfo.dataset) {
      for (const dataObj of clientInfo.data) {
        let label;
        if (
          this.resourceRequirementChartData.category ==
          this.cookiesConstants.stage
        ) {
          label = dataObj.stage.description;
        } else {
          label = dataObj.status.description;
        }
        transformedData[label] = Array(30).fill(0);
      }
    }
    for (const clientInfo of resourceRequirementInfo.dataset) {
      const givenDate = new Date(clientInfo.Date);
      for (const dataObj of clientInfo.data) {
        let label;
        if (
          this.resourceRequirementChartData.category ==
          this.cookiesConstants.stage
        ) {
          label = dataObj.stage.description;
        } else {
          label = dataObj.status.description;
        }
        const count = dataObj.Count;
        const dataDate = new Date(clientInfo.Date);
        if (!isNaN(dataDate.getTime())) {
          const index = this.dashboardHelperService.getDayDifference(
            givenDate,
            dataDate
          );
          if (index >= 0 && index < 5) {
            transformedData[label][index] += count;
          }
        }
      }
    }
    const outputData: resourceRequirementDataSet[] = Object.entries(
      transformedData
    ).map(([label, data]) => ({
      label: label,
      data: data,
      backgroundColor: this.dashboardHelperService.getRandomColor(),
      borderColor: this.dashboardHelperService.getRandomColor(),
      borderWidth: 1,
    }));
    this.initializeChart(outputData);
  }

  applyCanvasStyles() {
    const canvasElement = this.resourceRequirementCanvas.nativeElement;
    Object.assign(canvasElement.style, this.chartStyles);
  }

  initializeChart(data?: resourceRequirementDataSet[]) {
    data = data as resourceRequirementDataSet[];
    this.resourceChart = new Chart(
      this.resourceRequirementCanvas.nativeElement,
      {
        type: Common.bar,
        data: {
          labels: this.resourceRequirementChartData.label,
          datasets: data,
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: Common.resource_requirement,
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
      }
    );
  }
}
