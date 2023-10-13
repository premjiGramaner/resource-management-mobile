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

@Component({
  selector: 'app-client',
  templateUrl: './client.page.html',
  styleUrls: ['./client.page.scss'],
})
export class ClientPage implements OnInit {
  showSearch: boolean = false;
  clientData: any = [];
  clientMoreData: any;
  skip: number = 0;
  searchQuery: string = '';
  isModalOpen: boolean = false;
  modelType!: string;

  @ViewChild('addClient') addClient !: AddClientComponent;
  constructor(
    private clientService: ClientService,
    private toastService: ToastService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getClient(this.skip, 20, this.searchQuery);
  }

  private getClient(skip: number, limit: number, search: string) {
    this.clientService.getClient(skip, limit, search).subscribe((data: any) => {
      this.clientData = [...this.clientData, ...data.data.clientInfo];
    });
  }

  saveClientForm() {
    if (this.addClient.isClientFormValid()) {
      console.log('Child form is valid');
    }
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
      error: (response) => {
      },
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
  setOpen(isOpen: boolean) {
    this.modelType = isOpen ? 'save' : 'edit';
    this.isModalOpen = isOpen;
  }

  editEvent(type: string) {
    this.modelType = type;
  }
}
