import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController, ToastController } from '@ionic/angular';
import { HiringService } from './service/hiring.service';
import { hiringData, hiringResponse } from './model/hiring.model';
import { BehaviorSubject } from 'rxjs';
import { DeleteNavComponent } from 'src/app/shared/components/delete-nav/delete-nav.component';
import { ExportOptionComponent } from 'src/app/shared/components/export-option/export-option.component';

@Component({
  selector: 'app-resource-hiring',
  templateUrl: './resource-hiring.page.html',
  styleUrls: ['./resource-hiring.page.scss'],
})
export class ResourceHiringPage implements OnInit {
  
  showSearch: boolean = false;
  items: any = [];
  skip: number = 0;
  searchQuery: string = '';

  hiringData: any;
  isModalOpen: boolean = false;
  modelType!: string;
  constructor(private hiringService: HiringService, private modalCtrl: ModalController, private toastController: ToastController) { }

  ngOnInit() {
    this.getHiring(this.skip, 20, this.searchQuery);
  }

  saveForm() {
    // if (this.add.isFormValid()) {
    //   this.addEditCall(this.resourceData)
    //     .subscribe((data: any) => {
    //       this.resourceData = undefined;
          // this.modelType = false ? 'save' : 'edit';
          // this.isModalOpen = false;
    //       this.items = [];
    //       this.getResources(this.skip, 20, this.searchQuery);
    //     });
    // } else {
    //   this.add.addform.markAllAsTouched();
    // }
  }

  addEditCall(editData: any) {
    // if (editData) {
    //   return this.resourceService.updateResource(this.add.addform.value)
    // } else {
    //   return this.resourceService.addresource(this.add.addform.value)
    // }
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
      const pdfHeader = ["Resource Name", "Evaluated By", "Hiring Status", "Hiring Stage", "Status", "Evaluated Date"];
      //pdf header details
      let req = {
        filename: 'hiring',
        data: res.data.HiringInfo,
        pdfData: pdfTableData,
        pdfHeader: pdfHeader,
        title: 'Hiring Report',
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
        if(data.data.HiringInfo.length==0 && skip>0){
          this.skip= skip-20;
        }
        this.items = [...this.items, ...data.data.HiringInfo];
      });

  }

  private deleteHiring(id: number, index: number) {
    this.hiringService.deleteHiring(id).subscribe({
      next: (response: any) => {
        this.presentToast(response?.message)
        this.modalCtrl.dismiss();
        this.items.splice(index, 1);
      },
      error: (response) => {
        this.presentToast(response.message)
      },
    });
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'top'
    });

    await toast.present();
  }

  onIonInfinite(ev: any) {
    this.skip = this.skip + 20;
    this.getHiring(this.skip, 20, this.searchQuery);
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  changeModal(item: any, index: number, sliding: any) {
    
  }
  async deleteModal(item: hiringData, index: number, sliding: any) {
    let data = {
      "from": "Hiring",
      "type": "Delete",
      "value": item.resource_name
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

  detailData(info: any, type: string) {
    this.hiringData = info;
    this.modelType = type;
    this.isModalOpen = true;
  }

  setOpen(isOpen: boolean) {
    this.hiringData = undefined;
    this.modelType = isOpen ? 'save' : 'edit';
    this.isModalOpen = isOpen;
  }

  async backForm(modelType: string) {
    if (modelType == 'save') {
      let data = {
        "from": "Hiring",
        "type": "Discard",
        "value": ''
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
          this.modelType = false ? 'save' : 'edit';
          this.isModalOpen = false;
          modal.dismiss();
        }
      });

      modal.onDidDismiss().then((_ => {
        mySubject.unsubscribe();
      }));
    } else {
      this.hiringData = undefined;
      this.modelType = false ? 'save' : 'edit';
      this.isModalOpen = false;
    }
  }
  editEvent(type: string) {
    this.modelType = type;
  }

}
