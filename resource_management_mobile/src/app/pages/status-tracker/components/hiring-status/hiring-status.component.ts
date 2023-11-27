import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, IonItemSliding, ModalController } from '@ionic/angular';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';
import { Status } from 'src/app/core/enum/status.enum';
import { ToastService } from 'src/app/core/toast/toast.service';
import { hiringData, hiringResponse, updateHiringStatus } from 'src/app/pages/resource-hiring/model/hiring.model';
import { HiringService } from 'src/app/pages/resource-hiring/service/hiring.service';

@Component({
  selector: 'app-hiring-status',
  templateUrl: './hiring-status.component.html',
  styleUrls: ['./hiring-status.component.scss'],
})
export class HiringStatusComponent implements OnInit {

  showSearch: boolean = false;
  items: hiringData[] = [];
  skip: number = 0;
  searchQuery: string = '';

  hiringData: hiringData | undefined;
  isModalOpen: boolean = false;
  isChangeOpen: boolean = false;
  modelType!: string;

  hiringItem: hiringData | undefined;

  constructor(private hiringService: HiringService, private modalCtrl: ModalController, private toastService: ToastService, private statisConstants: StaticDataConstants) { }

  ngOnInit() {
    this.getHiring(this.skip, 20, this.searchQuery);
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
    this.hiringService.getHiringAdminData(skip, limit, search)
      .subscribe((data: hiringResponse) => {
        if (data.data.HiringInfo.length == 0 && skip > 0) {
          this.skip = skip - 20;
        }
        this.items = [...this.items, ...data.data.HiringInfo];
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

  detailData(info: hiringData, type: string) {
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
    this.hiringData = undefined;
    this.modelType = false ? Status.SAVE : Status.EDIT;
    this.isModalOpen = false;
  }
}
