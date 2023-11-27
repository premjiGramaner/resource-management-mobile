import { Component, OnInit, ViewChild } from '@angular/core';

import { InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { ToastService } from 'src/app/core/toast/toast.service';
import { BehaviorSubject } from 'rxjs';
import { DeleteNavComponent } from 'src/app/shared/components/delete-nav/delete-nav.component';
import { ToastConstants } from 'src/app/core/constant/toast.message.constant';
import { AddPartnerComponent } from './add-partner/add-partner.component';
import { ExportOptionComponent } from 'src/app/shared/components/export-option/export-option.component';
import { partnerData, partnerResponce } from './models/partner.model';
import { PartnerService } from './services/partner.service';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.page.html',
  styleUrls: ['./partner.page.scss'],
})
export class PartnerPage implements OnInit {
  partnerData: partnerData[] = [];
  showSearch: boolean = false;
  skip: number = 0;
  searchQuery: string = '';
  isModalOpen: boolean = false;
  modelType!: string;
  partnerMoreData!: partnerData;
  partnerEdit: boolean = false;
  selectedIndex: number = 0;
  @ViewChild('addPartner') addPartner!: AddPartnerComponent;
  constructor(
    private partnerService: PartnerService,
    private toastService: ToastService,
    private modalCtrl: ModalController,
    private toastConstants: ToastConstants
  ) { }

  ngOnInit() {
    this.getPartner(this.skip, 20, this.searchQuery);
  }

  getPartner(skip: number, limit: number, search: string) {
    this.partnerService
      .getPartner(skip, limit, search)
      .subscribe((data: partnerResponce) => {
        this.partnerData = [...this.partnerData, ...data.data.partnerInfo];
      });
  }
  savePartnerForm() {
    if (this.addPartner.isPartnerFormValid()) {
      if (!this.partnerEdit) {
        this.partnerService
          .postPartner(this.addPartner.partnerForm.value)
          .subscribe((res: any) => {
            this.toastService.presentToast(res.message);
            // save data to local array
            this.partnerData.unshift(this.addPartner.partnerForm.value);
            this.isModalOpen = false;
          });
      } else {
        let updateReq = this.addPartner.partnerForm.value;
        updateReq['partner_id'] = this.partnerMoreData.partner_id;
        this.partnerService.editPartner(updateReq).subscribe((res: any) => {
          this.toastService.presentToast(res.message);
          // save data to local array
          this.partnerData.splice(this.selectedIndex, 1);
          this.partnerData.unshift(this.addPartner.partnerForm.value);
          this.isModalOpen = false;
        });
      }
    }
  }

  onIonInfinite(ev: any) {
    this.skip = this.skip + 20;
    this.getPartner(this.skip, 20, this.searchQuery);
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  detailClientData(patnerInfo: any, type: string) {
    this.partnerData = patnerInfo;
    this.modelType = type;
  }

  deleteClient(id: string, index: number) {
    this.partnerService.deletePartner(id).subscribe({
      next: (response: any) => {
        this.partnerData.splice(index, 1);
        this.toastService.presentToast(
          this.toastConstants.Delete_success_message
        );
      },
      error: (response) => {
        this.toastService.errorToast(this.toastConstants.try_again);
      },
    });
  }

  async deleteModal(item: any, index: any, sliding: any) {
    let data = {
      from: 'Partner',
      type: 'Delete',
      value: item.name,
    };
    const mySubject = new BehaviorSubject(data);
    const modal = await this.modalCtrl.create({
      component: DeleteNavComponent,
      breakpoints: [0, 0.5, 1],
      initialBreakpoint: 0.3,
      handle: false,
      componentProps: {
        mySubject,
      },
    });
    await modal.present();

    mySubject.subscribe((value: any) => {
      if (value == true) {
        this.deleteClient(item.partner_id, index);
      }
    });

    modal.onDidDismiss().then((_) => {
      mySubject.unsubscribe();
    });
    sliding.close();
  }

  onSearch() {
    this.showSearch = !this.showSearch;
  }

  setOpen(isOpen: boolean, type: string, partnerInfo?: any, index?: any) {
    this.modelType = type;
    this.isModalOpen = isOpen;
    this.partnerEdit = false;
    this.partnerMoreData = partnerInfo;
    this.selectedIndex = index;
  }

  enableEdit() {
    this.partnerEdit = true;
    this.modelType = 'save';
  }

  handleSearch(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
    this.partnerData = [];
    this.skip = 0;
    this.getPartner(this.skip, 20, this.searchQuery);
  }

  async openExportModel() {
    this.partnerService
      .getAllPartner()
      .subscribe(async (res: partnerResponce) => {
        const keyToRemove = [
          'created_date',
          'skills',
          'updated_by',
          'updated_date',
          'partner_id',
          'created_by_id',
          'updated_by_id',
          'created_by',
        ];
        const newArray = res.data.partnerInfo.map((obj: any) => {
          const newObj = { ...obj };
          keyToRemove.map((item) => {
            delete newObj[item];
          });
          return newObj;
        });
        const pdfTableData = newArray.map((item: partnerData) => {
          return [
            item.name || '',
            item.pan || '',
            item.registration_number || '',
            item.strength || '',
            item.supported_mode || '',
            item.gstn || '',
            item.contact_person_phone || '',
            item.contact_person_name || '',
            item.contact_person_email_id || '',
            item.address || '',
          ];
        });
        let keys = Object.keys(newArray[0]);
        let pdfHeader = keys.reduce((result: any, item: any) => {
          result.push(item.split('_').join('').toUpperCase());
          return result;
        }, []);
        //pdf header details
        let req = {
          filename: 'partner',
          data: res.data.partnerInfo,
          pdfData: pdfTableData,
          pdfHeader: pdfHeader,
          title: 'Partner PDF Report',
          size: [430, 300],
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
        modal.onDidDismiss().then((_) => { });
      });
  }

  async backForm(modelType: string) {
    if (modelType == 'save' || this.partnerEdit) {
      let data = {
        from: 'Partner',
        type: 'Discard',
        value: '',
      };
      const mySubject = new BehaviorSubject(data);

      const modal = await this.modalCtrl.create({
        component: DeleteNavComponent,
        breakpoints: [0, 0.5, 1],
        initialBreakpoint: 0.35,
        handle: false,
        componentProps: {
          mySubject,
        },
      });
      await modal.present();

      mySubject.subscribe((value: any) => {
        if (value == true) {
          this.modelType = 'save';
          this.isModalOpen = false;
          modal.dismiss();
        }
      });

      modal.onDidDismiss().then((_) => {
        mySubject.unsubscribe();
      });
    } else {
      this.isModalOpen = false;
    }
  }
}
