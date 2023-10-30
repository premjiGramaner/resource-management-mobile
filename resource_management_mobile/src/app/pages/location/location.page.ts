import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { ToastConstants } from 'src/app/core/constant/toast.message.constant';
import { ToastService } from 'src/app/core/toast/toast.service';
import { LocationService } from './services/location.service';
import { DeleteNavComponent } from 'src/app/shared/components/delete-nav/delete-nav.component';
import { BehaviorSubject } from 'rxjs';
import { locationResponce } from './models/locaton.model';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {
  showSearch: boolean = false;
  locationData: any[] = [];
  skip: number = 0;
  searchQuery: string = '';
  isModalOpen: boolean = false;
  modelType!: string;
  locationMoreData!: any;
  locationEdit: boolean = false;

  constructor(
    private locationService: LocationService,
    private toastService: ToastService,
    private modalCtrl: ModalController,
    private toastConstants: ToastConstants
  ) { }

  ngOnInit() {
    this.getLocation(this.skip, 20, this.searchQuery);
  }

  onSearch() {
    this.showSearch = !this.showSearch;
  }

  getLocation(skip: number, limit: number, search: string) {
    this.locationService
      .getLocation(skip, limit, search)
      .subscribe((data: locationResponce) => {
        this.locationData = [...this.locationData, ...data.data.locationInfo];
      });
  }

  onIonInfinite(ev: any) {
    this.skip = this.skip + 20;
    this.getLocation(this.skip, 20, this.searchQuery);
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  setOpen(isOpen: boolean, type: string, locationInfo?: any) {
    this.modelType = type;
    this.isModalOpen = isOpen;
    this.locationEdit = false;
    this.locationMoreData = locationInfo;
  }

  handleSearch(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
    this.locationData = [];
    this.skip = 0;
    this.getLocation(this.skip, 20, this.searchQuery);
  }

  deleteLocation(id: string, index: number) {
    this.locationService.deleteLocation(id).subscribe({
      next: (response) => {
        response = response as locationResponce;
        this.locationData.splice(index, 1);
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
      from: 'Location',
      type: 'Delete',
      value: item.Description,
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
        this.deleteLocation(item.Location_ID, index);
      }
    });

    modal.onDidDismiss().then((_) => {
      mySubject.unsubscribe();
    });
    sliding.close();
  }
}
