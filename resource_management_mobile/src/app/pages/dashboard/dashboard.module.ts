import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';
import { HttpClientModule } from '@angular/common/http';
import { ClientChartComponent } from './charts/client-chart/client-chart.component';
import { RequirementChartComponent } from './charts/requirement-chart/requirement-chart.component';
import { ResourceChartComponent } from './charts/resource-chart/resource-chart.component';
import { RemainderChartComponent } from './charts/remainder-chart/remainder-chart.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    DashboardPageRoutingModule,
  ],
  declarations: [
    DashboardPage,
    ClientChartComponent,
    RequirementChartComponent,
    ResourceChartComponent,
    RemainderChartComponent
  ],
  providers: [StaticDataConstants],
})
export class DashboardPageModule { }
