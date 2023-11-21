import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { DashboardHelperService } from '../../services/dashboard-helper.service';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';
import { clientChartData, ChartInstance, requirementChartData, requirementDataSet } from '../../models/dashboard.model';
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Common } from 'src/app/core/enum/static.enum';
@Component({
  selector: 'app-remainder-chart',
  templateUrl: './remainder-chart.component.html',
  styleUrls: ['./remainder-chart.component.scss'],
})
export class RemainderChartComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() remainderChartData!: requirementChartData;
  remainderChart!: ChartInstance;
  @ViewChild('remainderCanvas') private remainderCanvas!: ElementRef;
  chartStyles = this.staticDataConstants.chartStyles;
  constructor(
    private staticDataConstants: StaticDataConstants,
    private dashboardHelperService: DashboardHelperService) { }

  ngOnInit() { }
  ngAfterViewInit() {
    this.applyCanvasStyles();
    this.initializeChart();
  }

  ngOnChanges() {
    if (this.remainderChartData.dataset.length != 0) {
      this.remainderChart.destroy();
      const filterType: string = this.remainderChartData.filterType.toUpperCase();
      if (filterType == Common.month.toUpperCase()) {

      } else if (filterType == Common.year.toUpperCase()) {

      }
      else if (filterType == Common.date.toUpperCase()) {
      }
    }
  }
  applyCanvasStyles() {
    const canvasElement = this.remainderCanvas.nativeElement;
    Object.assign(canvasElement.style, this.chartStyles);
  }
  initializeChart(data?: requirementDataSet[]) {
    data = data as requirementDataSet[]
    this.remainderChart = new Chart(this.remainderCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.remainderChartData.label,
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
}
