import { Component, OnInit } from '@angular/core';
import { NotificationService } from './services/notification.service';
import { HiringInfo, notificationResponce } from './model/notification.model';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

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
  constructor(private notificationService: NotificationService) {

  }

  ngOnInit() {
    this.getNotification(this.skip, 20, this.searchQuery);
  }

  getNotification(skip: number, limit: number, search: string) {
    this.notificationService
      .getNotification(skip, limit, search)
      .subscribe((data: notificationResponce) => {
        this.notificationData = [...this.notificationData, ...data.data.HiringInfo];
        console.log(this.notificationData);

      });
  }

  onIonInfinite(ev: any) {
    this.skip = this.skip + 20;
    this.getNotification(this.skip, 20, this.searchQuery);
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
}
