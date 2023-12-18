import { Component, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, IonItemSliding, ModalController } from '@ionic/angular';
import { HiringService } from './service/hiring.service';
import { deleteHiringResponce, hiringData, hiringResponse, updateHiringStatus } from './model/hiring.model';
import { BehaviorSubject } from 'rxjs';
import { DeleteNavComponent } from 'src/app/shared/components/delete-nav/delete-nav.component';
import { ExportOptionComponent } from 'src/app/shared/components/export-option/export-option.component';
import { AddHiringComponent } from './add-hiring/add-hiring.component';
import { ToastService } from 'src/app/core/toast/toast.service';
import { Status } from 'src/app/core/enum/status.enum';
import { Common, Modules } from 'src/app/core/enum/static.enum';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';
import { DateformatConverterPipe } from 'src/app/shared/helpers/pipes/dateformat-converter.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-resource-hiring',
  templateUrl: './resource-hiring.page.html',
  styleUrls: ['./resource-hiring.page.scss'],
})
export class ResourceHiringPage implements OnInit {

  showSearch: boolean = false;
  items: hiringData[] = [];
  skip: number = 0;
  searchQuery: string = '';

  hiringData: hiringData | undefined;
  isModalOpen: boolean = false;
  isChangeOpen: boolean = false;
  modelType!: string;

  hiringItem: hiringData | undefined;

  @ViewChild('add') add !: AddHiringComponent;

  constructor(private hiringService: HiringService, private modalCtrl: ModalController, private toastService: ToastService, private statisConstants: StaticDataConstants, private dateformatConverterPipe:DateformatConverterPipe, private datePipe: DatePipe) { }

  ngOnInit() {
    this.getHiring(this.skip, 20, this.searchQuery);
  }

  saveForm() {
    if (this.add.isFormValid()) {
      this.addEditCall(this.hiringData)
        .subscribe(() => {
          this.hiringData = undefined;
          this.modelType = false ? Status.SAVE : Status.EDIT;
          this.isModalOpen = false;
          this.items = [];
          this.skip = 0;
          this.getHiring(this.skip, 20, this.searchQuery);
        });
    } else {
      this.add.addform.markAllAsTouched();
    }
  }

  addEditCall(editData: hiringData | undefined) {
    this.add.addform.patchValue({
      evaluated_date: this.dateformatConverterPipe.transform(
        this.add.addform.value.evaluated_date
      ) as string
    })
    if (editData) {
      return this.hiringService.updateHiring(this.add.addform.value)
    } else {
      return this.hiringService.addHiring(this.add.addform.value)
    }
  }

  async openExportModel() {
    this.hiringService.getHiringAllData().subscribe(async (res: hiringResponse) => {
      const pdfTableData = res.data.HiringInfo.map((item: hiringData) => {
        return [
          item.resource_name || '',
          item.evaluated_by_name || '',
          item.hiring_status || '',
          item.hiring_stage || '',
          item.status || '',
          item.evaluated_date || ''
        ];
      });
      const pdfHeader = this.statisConstants.hiring_report_header;
      //pdf header details
      let req = {
        filename: Modules.Hiring.toLowerCase(),
        data: res.data.HiringInfo,
        pdfData: pdfTableData,
        pdfHeader: pdfHeader,
        title: Modules.Hiring + ' ' + Common.report,
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

  onSearch() {
    this.showSearch = !this.showSearch;
  }

  handleSearch(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
    this.items = [];
    this.skip = 0;
    this.getHiring(this.skip, 20, this.searchQuery);
  }


  private getHiring(skip: number, limit: number, search: string) {
    this.hiringService.getHirings(skip, limit, search)
      .subscribe((data: hiringResponse) => {
        if (data.data.HiringInfo.length == 0 && skip > 0) {
          this.skip = skip - 20;
        }
        this.items = [...this.items, ...data.data.HiringInfo];
      });

  }

  private deleteHiring(id: number, index: number) {
    this.hiringService.deleteHiring(id).subscribe({
      next: (response: deleteHiringResponce) => {
        this.toastService.presentToast(response?.message)
        this.modalCtrl.dismiss();
        this.items.splice(index, 1);
      },
      error: (response) => {
        this.toastService.errorToast(response.message)
      },
    });
  }

  onIonInfinite(ev: any) {
    this.skip = this.skip + 20;
    this.getHiring(this.skip, 20, this.searchQuery);
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  changeModal(item: hiringData, index: number, sliding: IonItemSliding) {
    this.isChangeOpen = true;
    this.hiringItem = item;
    sliding.close();
  }

  changeStatus(form: updateHiringStatus) {
    this.hiringService.updateHiringStatus(form)
      .subscribe({
        next: (response: hiringResponse) => {
          this.toastService.presentToast(response?.message)
          this.hiringItem = undefined;
          this.isChangeOpen = false;
          this.items = [];
          this.skip = 0;
          this.getHiring(this.skip, 20, this.searchQuery);
        },
        error: (response) => {
          this.toastService.errorToast(response.message)
        },

      });
  }

  closeStatus() {
    this.isChangeOpen = false;
    this.hiringItem = undefined;
  }

  async deleteModal(item: hiringData, index: number, sliding: IonItemSliding) {
    let data = {
      from: Modules.Hiring,
      type: Common.Delete,
      value: item.resource_name
    }
    const mySubject = new BehaviorSubject(data);

    const modal = await this.modalCtrl.create({
      component: DeleteNavComponent,
      breakpoints: [0, 0.5, 1],
      initialBreakpoint: 0.35,
      handle: false,
      componentProps: {
        mySubject
      },
    });
    await modal.present();

    mySubject.subscribe((value: any) => {
      if (value == true) {
        this.deleteHiring(item.hiring_tracker_id, index);
      }
    });

    modal.onDidDismiss().then((_ => {
      mySubject.unsubscribe();
    }));
    sliding.close();
  }

  detailData(info: hiringData, type: string) {
    info.evaluated_date = this.datePipe.transform(info.evaluated_date, 'dd/MM/yyyy') || "";
    this.hiringData = info;
    this.modelType = type;
    this.isModalOpen = true;
  }

  setOpen(isOpen: boolean) {
    this.hiringData = undefined;
    this.modelType = isOpen ? Status.SAVE : Status.EDIT;
    this.isModalOpen = isOpen;
  }

  async backForm(modelType: string) {
    if (modelType == Status.SAVE) {
      let data = {
        from: Modules.Hiring,
        type: Common.Discard,
        value: ''
      }
      const mySubject = new BehaviorSubject(data);

      const modal = await this.modalCtrl.create({
        component: DeleteNavComponent,
        breakpoints: [0, 0.5, 1],
        initialBreakpoint: 0.35,
        handle: false,
        componentProps: {
          mySubject
        },
      });
      await modal.present();

      mySubject.subscribe((value: any) => {
        if (value == true) {
          this.hiringData = undefined;
          this.modelType = false ? Status.SAVE : Status.EDIT;
          this.isModalOpen = false;
          modal.dismiss();
        }
      });

      modal.onDidDismiss().then((_ => {
        mySubject.unsubscribe();
      }));
    } else {
      this.hiringData = undefined;
      this.modelType = false ? Status.SAVE : Status.EDIT;
      this.isModalOpen = false;
    }
  }
  editEvent(type: string) {
    this.modelType = type;
  }

}
