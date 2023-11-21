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
Chart.register(zoomPlugin);
import {
  ChartInstance,
  ClientDataSet,
  clientChartData,
  clientFilterData,
  countDetails,
} from '../../models/dashboard.model';
import { Common } from 'src/app/core/enum/static.enum';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';
import { DashboardHelperService } from '../../services/dashboard-helper.service';
@Component({
  selector: 'app-client-chart',
  templateUrl: './client-chart.component.html',
  styleUrls: ['./client-chart.component.scss'],
})

export class ClientChartComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() clientChartData!: clientChartData;
  barChart!: ChartInstance;
  @ViewChild('barCanvas') private barCanvas!: ElementRef;
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
    if (this.clientChartData.dataset.length != 0) {
      this.barChart.destroy();
      const filterType: string = this.clientChartData.filterType.toUpperCase();
      if (filterType == Common.month.toUpperCase()) {
        this.dashboardMonthData();
      } else if (filterType == Common.year.toUpperCase()) {
        this.dashboardYearData(this.clientChartData);
      }
      else if (filterType == Common.date.toUpperCase()) {
        this.dashboardDayData(this.clientChartData);
      }
    }
  }

  applyCanvasStyles() {
    const canvasElement = this.barCanvas.nativeElement;
    Object.assign(canvasElement.style, this.chartStyles);
  }

  dashboardMonthData() {
    const uniqueOwners = this.clientChartData.dataset.reduce(
      (acc: string[], info: clientFilterData) => {
        info.data.forEach((entry: countDetails) => {
          if (!acc.includes(entry.owner.name)) {
            acc.push(entry.owner.name);
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
      ownersData[owner] = new Array(this.clientChartData.label.length).fill(0);
    });
    this.clientChartData.dataset.forEach((info: clientFilterData) => {
      const { Date, data } = info;
      data.forEach((entry: countDetails) => {
        const owner = entry.owner.name;
        const index = Date - this.clientChartData.label.length;
        ownersData[owner][index] = entry.Count;
      });
    });
    const output: ClientDataSet[] = Object.entries(ownersData).map(([owner, data]) => ({
      label: owner,
      data: data as string[],
      backgroundColor: this.dashboardHelperService.getRandomColor(),
      borderColor: this.dashboardHelperService.getRandomColor(),
      borderWidth: 1,
    }));
    this.initializeChart(output);
  }

  dashboardDayData(rawData: clientChartData) {

    const dateMap = new Map<string, number[]>();
    rawData.dataset.forEach((entry: clientFilterData) => {
      dateMap.set('' + entry.Date, new Array(30).fill(0));
    });
    rawData.dataset.forEach((entry: clientFilterData) => {
      const counts = new Array(30).fill(0);
      entry.data.forEach((item: any) => {
        const index = new Date(entry.Date).getDate() - 1;
        counts[index] += item.Count;
      });
      dateMap.set('' + entry.Date, counts);
    });
    const ownersMap = new Map<string, number[]>();
    rawData.dataset.forEach((entry: clientFilterData) => {
      entry.data.forEach((item: countDetails) => {
        const owner = item.owner.name;
        if (!ownersMap.has(owner)) {
          ownersMap.set(owner, new Array(30).fill(0));
        }
      });
    });

    rawData.dataset.forEach((entry: clientFilterData) => {
      const counts = new Array(30).fill(0);
      entry.data.forEach((item: countDetails) => {
        const ownerCounts = ownersMap.get(item.owner.name);
        const index = new Date(entry.Date).getDate() - 1;
        ownerCounts![index] += item.Count;
      });
    });
    const outputData: any[] = [];
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

  getDayDifference(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
    return diffDays;
  }

  dashboardYearData(dashboardClientInfo: clientChartData) {
    const transformedData: { [key: string]: number[] } = {};
    for (const clientInfo of dashboardClientInfo.dataset) {
      for (const dataObj of clientInfo.data) {
        const label = dataObj.owner.name;
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

  initializeChart(data?: ClientDataSet[]) {
    data = data as ClientDataSet[];
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.clientChartData.label,
        datasets: data,
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Client chart',
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
}
