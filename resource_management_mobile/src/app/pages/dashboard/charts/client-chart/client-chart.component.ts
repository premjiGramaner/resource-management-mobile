import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';
import {
  clientChartData,
  clientFilterData,
  countDetails,
} from '../../models/dashboard.model';
@Component({
  selector: 'app-client-chart',
  templateUrl: './client-chart.component.html',
  styleUrls: ['./client-chart.component.scss'],
})
export class ClientChartComponent implements OnInit, OnChanges {
  @Input() clientChartData!: clientChartData;
  barChart!: Object;
  @ViewChild('barCanvas') private barCanvas!: ElementRef;
  constructor() { }

  ngOnInit() {
    console.log(this.clientChartData);
  }
  ngOnChanges() {
    if (this.clientChartData.dataset.length != 0) {
      this.barChartMethod();
    }
  }
  barChartMethod() {
    const uniqueOwners = this.clientChartData.dataset.reduce(
      (acc: string[], info: any) => {
        info = info as clientFilterData;
        info.data.forEach((entry: any) => {
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
    this.clientChartData.dataset.forEach((info: any) => {
      info = info as clientFilterData;
      const { Date, data } = info;
      data.forEach((entry: countDetails) => {
        const owner = entry.owner.name;
        const index = Date - this.clientChartData.label.length;
        ownersData[owner][index] = entry.Count;
      });
    });

    const output = Object.entries(ownersData).map(([owner, data]) => ({
      label: owner,
      data: data,
      backgroundColor: this.getRandomColor(),
      borderColor: this.getRandomColor(),
      borderWidth: 1,
    }));

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.clientChartData.label,
        datasets: output,
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Client chart',
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
  getRandomColor() {
    return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)}, 0.5)`;
  }
}
