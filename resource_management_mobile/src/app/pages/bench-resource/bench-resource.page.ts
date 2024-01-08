import { Component, OnInit } from '@angular/core';
import { BenchResourceService } from './service/bench-resource.service';
import { resourceData, resourceResponse } from '../resource/models/resource.model';
import { benchResponse } from './model/bench.resource';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';
import { Common, Modules } from 'src/app/core/enum/static.enum';
import { ModalController } from '@ionic/angular';
import { ToastService } from 'src/app/core/toast/toast.service';
import { ExportOptionComponent } from 'src/app/shared/components/export-option/export-option.component';

@Component({
  selector: 'app-bench-resource',
  templateUrl: './bench-resource.page.html',
  styleUrls: ['./bench-resource.page.scss'],
})
export class BenchResourcePage implements OnInit {
  benchData: resourceData[] = [];
  showSearch: boolean = false;
  skip: number = 0;
  searchQuery: string = '';
  constructor(
    private benchResourceService: BenchResourceService,
    private staticData: StaticDataConstants,
    private modalCtrl: ModalController,
    private toastService: ToastService) { }

  ngOnInit() {
    this.getBench(this.skip, 20, this.searchQuery);
  }

  getBench(skip: number, limit: number, search: string) {
    this.benchResourceService
      .getBenchData(skip, limit, search)
      .subscribe((data: benchResponse) => {
        console.log(data)
        this.benchData = [...this.benchData, ...data.data.resourceInfo];
      });
  }

  onSearch() {
    this.showSearch = !this.showSearch;
  }

  handleSearch(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
    this.benchData = [];
    this.skip = 0;
    this.getBench(this.skip, 20, this.searchQuery);
  }

  async openExportModel() {
    this.benchResourceService.getAllBenchData().subscribe(async (res: benchResponse) => {
      const pdfTableData = res.data.resourceInfo.map((item: resourceData) => {
        return [
          item.name || '',
          item.email_id || '',
          item.mobile_no || '',
          item.experience || '',
          item.source || '',
          item.partner_name ? item.partner_name : '',
          item.type || '',
          item.profile_location || '',
          item.current_organisation || '',
          item.current_org_duration || '',
          item.ctc || '',
          item.ectc || '',
          item.preferred_location_name || '',
          item.work_location_name || '',
          item.current_location_name || '',
          item.notice_period || '',
          item.earliest_joining_date || '',
          item.reason_for_change || '',
          item.created_by || '',
          item.updated_by || '',
        ];
      });
      const pdfHeader = this.staticData.resource_report_header;
      //pdf header details
      let req = {
        filename: Modules.Bench_resource.toLowerCase(),
        data: res.data.resourceInfo,
        pdfData: pdfTableData,
        pdfHeader: pdfHeader,
        title: Modules.Bench_resource + ' ' + Common.report,
        size: [400, 500],
      };
      const exportData = req;
      const modal = await this.modalCtrl.create({
        component: ExportOptionComponent,
        breakpoints: [0, 0.4, 1],
        initialBreakpoint: 0.3,
        handle: false,
        componentProps: {
          exportData,
        },
      });
      await modal.present();
      modal.onDidDismiss().then((_) => {
      });
    });
  }
}
