import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { ToastConstants } from 'src/app/core/constant/toast.message.constant';
import { ToastService } from 'src/app/core/toast/toast.service';
import { LocationService } from './services/location.service';
import { DeleteNavComponent } from 'src/app/shared/components/delete-nav/delete-nav.component';
import { BehaviorSubject } from 'rxjs';
import { locationData, locationResponce } from './models/locaton.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExportOptionComponent } from 'src/app/shared/components/export-option/export-option.component';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {
  locationForm!: FormGroup;
  showSearch: boolean = false;
  locationData: any[] = [];
  skip: number = 0;
  searchQuery: string = '';
  isModalOpen: boolean = false;
  modelType!: string;
  locationMoreData!: any;
  locationEdit: boolean = false;
  isEnableEdit: boolean = false;
  selectedIndex!: number;
  constructor(
    private locationService: LocationService,
    private toastService: ToastService,
    private modalCtrl: ModalController,
    private toastConstants: ToastConstants
  ) { }

  ngOnInit() {
    this.getLocation(this.skip, 20, this.searchQuery);
    this.locationForm = new FormGroup({
      Description: new FormControl('', Validators.required),
    });
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

  setOpen(isOpen: boolean, type: string, locationInfo?: any, index?: any) {
    this.modelType = type;
    this.isModalOpen = isOpen;
    this.locationEdit = false;
    this.locationMoreData = locationInfo;
    this.selectedIndex = index;
    this.setDataLocationForm(locationInfo);
  }

  setDataLocationForm(locationInfo: any) {
    if (locationInfo != undefined) {
      this.isEnableEdit = true;
      this.locationForm.patchValue({
        Description: locationInfo.Description,
      });
    } else {
      this.isEnableEdit = false;
      this.locationEdit = false;
      this.locationForm.reset();
    }
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
        this.toastService.errorToast(this.toastConstants.try_again);
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

  enableEdit() {
    this.locationEdit = true;
    this.isEnableEdit = false;
    this.modelType = 'save';
  }

  async backForm(modelType: string) {
    if (modelType == 'save' || this.locationEdit) {
      let data = {
        from: 'Location',
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

  saveLocationForm() {
    if (!this.locationEdit) {
      this.locationService
        .postLocation(this.locationForm.value)
        .subscribe((res) => {
          const skillResponse = res as locationResponce;
          this.toastService.presentToast(skillResponse.message);
          // save data to local array
          this.locationData.unshift(this.locationForm.value);
        });
    } else {
      let updateReq = this.locationForm.value;
      updateReq['Location_ID'] = this.locationMoreData.Location_ID;
      this.locationService.editLocation(updateReq).subscribe((res) => {
        const skillResponse = res as locationResponce;
        this.toastService.presentToast(skillResponse.message);
        // save data to local array
        this.locationData.splice(this.selectedIndex, 1, this.locationForm.value);
      });
    }
  }

  async openExportModel() {
    this.locationService
      .getAllLocation()
      .subscribe(async (res: locationResponce) => {
        const keyToRemove = ['Location_ID'];
        const newArray = res.data.locationInfo.map((obj: any) => {
          const newObj = { ...obj };
          keyToRemove.map((item) => {
            delete newObj[item];
          });
          return newObj;
        });
        const pdfTableData = newArray.map((item: locationData) => {
          return [item.Description || ''];
        });
        let keys = Object.keys(newArray[0]);
        let pdfHeader = keys.reduce((result: any, item: any) => {
          result.push(item.split('_').join('').toUpperCase());
          return result;
        }, []);
        //pdf header details
        let req = {
          filename: 'location',
          data: res.data.locationInfo,
          pdfData: pdfTableData,
          pdfHeader: pdfHeader,
          title: 'Location PDF Report',
          size: [400, 600],
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
}
