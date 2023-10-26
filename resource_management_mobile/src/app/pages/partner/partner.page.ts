import { Component, OnInit, ViewChild } from '@angular/core';
import { PartnerService } from './service/partner.service';
import { InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { ToastService } from 'src/app/core/toast/toast.service';
import { BehaviorSubject } from 'rxjs';
import { DeleteNavComponent } from 'src/app/shared/components/delete-nav/delete-nav.component';
import { ToastConstants } from 'src/app/core/constant/toast.message.constant';
import { AddPartnerComponent } from './add-partner/add-partner.component';
import { Status } from 'src/app/core/enum/status.enum';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.page.html',
  styleUrls: ['./partner.page.scss'],
})
export class PartnerPage implements OnInit {
  partnerData: any = [];
  showSearch: boolean = false;
  skip: number = 0;
  searchQuery: string = '';
  isModalOpen: boolean = false;
  modelType!: string;
  partnerMoreData: any;
  partnerEdit: boolean = false;
  selectedIndex: any;
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
      .getClient(skip, limit, search)
      .subscribe((data: any) => {
        console.log('data', data);
        this.partnerData = [...this.partnerData, ...data.data.partnerInfo];
      });
  }
  savePartnerForm() {
    if (this.addPartner.isPartnerFormValid()) {
      if (!this.partnerEdit) {
        alert('save');
        this.partnerService
          .postPartner(this.addPartner.partnerForm.value)
          .subscribe((res: any) => {
            this.toastService.presentToast(res.message);
            // save data to local array
            this.partnerData.unshift(this.addPartner.partnerForm.value);
          });
      } else {
        let updateReq = this.addPartner.partnerForm.value;
        updateReq['partner_id'] = this.partnerMoreData.partner_id;
        this.partnerService
          .editPartner(this.addPartner.partnerForm.value)
          .subscribe((res: any) => {
            this.toastService.presentToast(res.message);
            // save data to local array
            this.partnerData.splice(this.selectedIndex, 1);
            this.partnerData.unshift(this.addPartner.partnerForm.value);
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
        this.toastService.presentToast(this.toastConstants.try_again);
      },
    });
  }

  async deleteModal(item: any, index: number, sliding: any) {
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

  setOpen(isOpen: boolean, type: string, partnerInfo?: any, index?: number) {
    this.modelType = type;
    this.isModalOpen = isOpen;
    this.partnerEdit = false;
    this.partnerMoreData = partnerInfo;
    this.selectedIndex = index;
  }
  enableEdit() {
    this.partnerEdit = true;
    this.modelType = 'save';
    console.log(this.modelType);
  }
}
