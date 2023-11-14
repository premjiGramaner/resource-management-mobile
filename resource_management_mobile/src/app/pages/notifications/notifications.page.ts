import { Component, OnInit } from '@angular/core';
import { NotificationService } from './services/notification.service';
import { HiringInfo, notificationResponce } from './model/notification.model';
import { InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { ExportOptionComponent } from 'src/app/shared/components/export-option/export-option.component';
import { Modules } from 'src/app/core/enum/static.enum';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  notificationData: HiringInfo[] = [];
  skip: number = 0;
  searchQuery: string = '';
  showSearch: boolean = false;
  isModalOpen: boolean = false;
  viewNotificationData!: HiringInfo;
  constructor(
    private notificationService: NotificationService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getNotification(this.skip, 20, this.searchQuery);
  }

  getNotification(skip: number, limit: number, search: string) {
    this.notificationService
      .getNotification(skip, limit, search)
      .subscribe((data: notificationResponce) => {
        this.notificationData = [
          ...this.notificationData,
          ...data.data.HiringInfo,
        ];
      });
  }

  onIonInfinite(ev: any) {
    this.skip = this.skip + 20;
    this.getNotification(this.skip, 20, this.searchQuery);
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  onSearch() {
    this.showSearch = !this.showSearch;
  }

  handleSearch(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
    this.notificationData = [];
    this.skip = 0;
    this.getNotification(this.skip, 20, this.searchQuery);
  }

  async openExportModel() {
    this.notificationService
      .getAllNotification()
      .subscribe(async (res: notificationResponce) => {
        const keyToRemove = [
          'hiring_tracker_id',
          'Resource_resource_id',
          'evaluated_by',
          'Status_status_id',
        ];
        const newArray = res.data.HiringInfo.map((obj: HiringInfo) => {
          const newObj = { ...obj };
          keyToRemove.map((item: string) => {
            delete newObj[item as keyof HiringInfo];
          });
          return newObj;
        });
        const pdfTableData = newArray.map((item: HiringInfo) => {
          return [
            item.resource_name || '',
            item.evaluated_by_name || '',
            item.status || '',
            item.comments || '',
            item.hiring_status || '',
            item.hiring_stage || '',
            item.evaluated_date || '',
          ];
        });
        let keys = Object.keys(newArray[0]);
        let pdfHeader = keys.reduce((result: Array<string>, item: string) => {
          result.push(item.split('_').join('').toUpperCase());
          return result;
        }, []);
        //pdf header details
        let req = {
          filename: Modules.Notification,
          data: res.data.HiringInfo,
          pdfData: pdfTableData,
          pdfHeader: pdfHeader,
          title: `${Modules.Notification} PDF Report`,
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

  setOpen(isOpen: boolean, notification: HiringInfo) {
    this.isModalOpen = isOpen;
    this.viewNotificationData = notification;
  }

  backForm() {
    this.isModalOpen = false;
  }
}
