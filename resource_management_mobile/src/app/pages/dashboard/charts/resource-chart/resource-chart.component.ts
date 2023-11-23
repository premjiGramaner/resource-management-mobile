import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ChartInstance, ClientDataSet, resorceDetails, resourceChartData, resourceDataSet, resourceFilterData } from '../../models/dashboard.model';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';
import { Common } from 'src/app/core/enum/static.enum';
import { DashboardHelperService } from '../../services/dashboard-helper.service';
Chart.register(zoomPlugin);

@Component({
  selector: 'app-resource-chart',
  templateUrl: './resource-chart.component.html',
  styleUrls: ['./resource-chart.component.scss'],
})
export class ResourceChartComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() resourceChartData!: resourceChartData;
  @ViewChild('resourceCanvas') private resourceCanvas!: ElementRef;
  resourceChart!: ChartInstance;
  chartStyles = this.staticDataConstants.chartStyles;
  noDataAvailable = Common.empty_chart;

  constructor(
    private staticDataConstants: StaticDataConstants,
    private dashboardHelperService: DashboardHelperService) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.applyCanvasStyles();
    this.initializeChart()
  }
  ngOnChanges() {
    if (this.resourceChartData.dataset.length != 0) {
      this.resourceChart.destroy();
      const filterType: string = this.resourceChartData.filterType.toUpperCase();
      if (filterType == Common.month.toUpperCase()) {
        this.resourceMonthData();
      }
      else if (filterType == Common.year.toUpperCase()) {
        this.resourceYearData(this.resourceChartData);
      }
      else if (filterType == Common.date.toUpperCase()) {
        this.resourceDayData(this.resourceChartData);
      }
    }
  }
  resourceYearData(dashboardClientInfo: resourceChartData) {
    const transformedData: { [key: string]: string[] } = {};
    for (const clientInfo of dashboardClientInfo.dataset) {
      for (const dataObj of clientInfo.data) {
        const label = dataObj.type;
        const year = Number(clientInfo.Date);
        const count = dataObj.Count;
        if (!transformedData[label]) {
          transformedData[label] = Array(5).fill(0);
        }
        const index = Number(dashboardClientInfo.label[0]) - year;
        transformedData[label][index] += count;
      }
    }
    const outputData: ClientDataSet[] = Object.entries(transformedData).map(
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
  resourceMonthData() {
    const uniqueOwners = this.resourceChartData.dataset.reduce(
      (acc: string[], info: resourceFilterData) => {
        info.data.forEach((entry: resorceDetails) => {
          if (!acc.includes('' + entry.type)) {
            acc.push('' + entry.type);
          }
        });
        return acc;
      },
      []
    );
    /**
     * ownersData key is  created dynamically
     */
    const ownersData: any = {};
    uniqueOwners.forEach((owner: string) => {
      ownersData[owner] = new Array(this.resourceChartData.label.length).fill(0);
    });
    this.resourceChartData.dataset.forEach((info: resourceFilterData) => {
      const { Date, data } = info;
      data.forEach((entry: resorceDetails) => {
        const owner = entry.type;
        const index = Date - this.resourceChartData.label.length;
        ownersData[owner][index] = entry.Count;
      });
    });
    const output: resourceDataSet[] = Object.entries(ownersData).map(([owner, data]) => ({
      label: owner,
      data: data as string[],
      backgroundColor: this.dashboardHelperService.getRandomColor(),
      borderColor: this.dashboardHelperService.getRandomColor(),
      borderWidth: 1,
    }));
    this.initializeChart(output);
  }

  resourceDayData(rawData: resourceChartData) {
    const dateMap = new Map<string, number[]>();
    rawData.dataset.forEach((entry: resourceFilterData) => {
      dateMap.set('' + entry.Date, new Array(30).fill(0));
    });
    rawData.dataset.forEach((entry: resourceFilterData) => {
      const counts = new Array(30).fill(0);
      entry.data.forEach((item: resorceDetails) => {
        const index = new Date(entry.Date).getDate() - 1;
        counts[index] += item.Count;
      });
      dateMap.set('' + entry.Date, counts);
    });
    const ownersMap = new Map<string, number[]>();
    rawData.dataset.forEach((entry: resourceFilterData) => {
      entry.data.forEach((item: resorceDetails) => {
        const owner = item.type;
        if (!ownersMap.has('' + owner)) {
          ownersMap.set('' + owner, new Array(30).fill(0));
        }
      });
    });

    rawData.dataset.forEach((entry: resourceFilterData) => {
      const counts = new Array(30).fill(0);
      entry.data.forEach((item: resorceDetails) => {
        const ownerCounts = ownersMap.get('' + item.type);
        const index = new Date(entry.Date).getDate() - 1;
        ownerCounts![index] += item.Count;
      });
    });
    const outputData: resourceDataSet[] = [];
    ownersMap.forEach((value, key) => {
      outputData.unshift({
        label: key,
        data: value,
        backgroundColor: this.dashboardHelperService.getRandomColor(),
        borderColor: this.dashboardHelperService.getRandomColor(),
        borderWidth: 1,
      });
    });
    this.initializeChart(outputData);
  }

  applyCanvasStyles() {
    const canvasElement = this.resourceCanvas.nativeElement;
    Object.assign(canvasElement.style, this.chartStyles);
  }

  initializeChart(data?: resourceDataSet[]) {
    data = data as resourceDataSet[];
    this.resourceChart = new Chart(this.resourceCanvas.nativeElement, {
      type: Common.bar,
      data: {
        labels: this.resourceChartData.label,
        datasets: data,
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Resource chart',
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
