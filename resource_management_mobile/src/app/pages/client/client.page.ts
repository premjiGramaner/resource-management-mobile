import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientService } from './service/client.service';
import {
  InfiniteScrollCustomEvent,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { ToastService } from 'src/app/core/toast/toast.service';
import { BehaviorSubject } from 'rxjs';
import { DeleteNavComponent } from 'src/app/shared/components/delete-nav/delete-nav.component';
import { AddClientComponent } from './add-client/add-client.component';
import { ClientArrayData, clientResponce } from './models/client.model';
import { ExportOptionComponent } from 'src/app/shared/components/export-option/export-option.component';
import { Status } from 'src/app/core/enum/status.enum';

@Component({
  selector: 'app-client',
  templateUrl: './client.page.html',
  styleUrls: ['./client.page.scss'],
})
export class ClientPage implements OnInit {
  showSearch: boolean = false;
  clientData: any = [];
  clientMoreData!: ClientArrayData;
  skip: number = 0;
  searchQuery: string = '';
  isModalOpen: boolean = false;
  modelType: string = 'save';
  clientEdit: boolean = false;
  @ViewChild('addClient') addClient!: AddClientComponent;
  constructor(
    private clientService: ClientService,
    private toastService: ToastService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getClient(this.skip, 20, this.searchQuery);
  }

  private getClient(skip: number, limit: number, search: string) {
    this.clientService
      .getClient(skip, limit, search)
      .subscribe((data: clientResponce) => {
        this.clientData = [...this.clientData, ...data.data.clientInfo];
      });
  }

  saveClientForm() {

    if (this.addClient.isClientFormValid()) {
      if (this.modelType.toLowerCase() == Status.SAVE.toLowerCase()) {
        this.clientService
          .postClient(this.addClient.clientForm.value)
          .subscribe((res) => {
            this.toastService.presentToast(res.message);
            // save data to local array
            this.clientData.unshift(this.addClient.clientForm.value);
            this.isModalOpen = false;
          });
      } else {
        let editedClientData = this.addClient.clientForm.value;
        editedClientData['client_id'] = this.clientMoreData.client_id;
        delete editedClientData['skill_id'];
        this.clientService
          .editClient(this.addClient.clientForm.value)
          .subscribe((res) => {
            this.toastService.presentToast(res.message);
            this.isModalOpen = false;
          });
      }
    }
  }

  editEvent(type: string) {
    this.modelType = type;
    this.clientEdit = true;
  }

  onIonInfinite(ev: any) {
    this.skip = this.skip + 20;
    this.getClient(this.skip, 20, this.searchQuery);
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  deleteClient(id: string, index: number) {
    this.clientService.deleteClient(id).subscribe({
      next: (response: any) => {
        this.clientData.splice(index, 1);
      },
      error: (response) => { },
    });
  }

  async deleteModal(item: any, index: number, sliding: any) {
    let data = {
      from: 'Client',
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
        this.deleteClient(item.client_id, index);
        modal.dismiss();
      }
    });

    modal.onDidDismiss().then((_) => {
      mySubject.unsubscribe();
    });
    sliding.close();
  }
  detailClientData(clientInfo: any, type: string) {
    this.clientMoreData = clientInfo;
    this.modelType = type;
  }

  setOpen(isOpen: boolean, type: string) {
    this.modelType = type;
    this.isModalOpen = isOpen;
    this.clientEdit = false;
  }

  async openExportModel() {
    this.clientService.getClientAllData().subscribe(async (res: any) => {
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
      const newArray = res.data.clientInfo.map((obj: any) => {
        const newObj = { ...obj };
        keyToRemove.map((item) => {
          delete newObj[item];
        });
        return newObj;
      });
      const pdfTableData = newArray.map((item: any) => {
        return [
          item.name || '',
          item.contact_person_name || '',
          item.contact_person_email_id || '',
          item.contact_person_phone || '',
          item.ownership_id ? item.ownership_id.toString() : '',
          item.sales_person_name || '',
          item.sales_person_email_id || '',
          item.sales_person_phone || '',
          item.finance_person_name || '',
          item.finance_person_email_id || '',
          item.finance_person_phone || '',
          item.strength || '',
          item.address || '',
          item.ownership_name || '',
        ];
      });
      let keys = Object.keys(newArray[0]);
      let pdfHeader = keys.reduce((result: any, item: any) => {
        result.push(item.split('_').join('').toUpperCase());
        return result;
      }, []);
      //pdf header details
      let req = {
        filename: 'client',
        data: res.data.clientInfo,
        pdfData: pdfTableData,
        pdfHeader: pdfHeader,
        title: 'Client PDF Report',
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

  onSearch() {
    this.showSearch = !this.showSearch;
  }

  async backForm(modelType: string) {
    if (modelType == 'save') {
      let data = {
        from: 'Client',
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
          // this.clientData = undefined;
          this.modelType = 'save';
          this.isModalOpen = false;
          modal.dismiss();
        }
      });

      modal.onDidDismiss().then((_) => {
        mySubject.unsubscribe();
      });
    } else {
      // this.clientData = undefined;
      this.isModalOpen = false;
    }
  }
  handleSearch(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
    this.clientData = [];
    this.skip = 0;
    this.getClient(this.skip, 20, this.searchQuery);
  }
}
