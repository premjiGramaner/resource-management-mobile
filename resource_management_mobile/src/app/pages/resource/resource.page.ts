import { Component, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, IonItemSliding, ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ResourceService } from './service/resource.service';
import { DeleteNavComponent } from 'src/app/shared/components/delete-nav/delete-nav.component';
import { AddResourceComponent } from './add-resource/add-resource.component';
import { ExportOptionComponent } from 'src/app/shared/components/export-option/export-option.component';
import { addResourceData, deleteResourceResponce, resourceData, resourceResponse } from './models/resource.model';
import { ToastService } from 'src/app/core/toast/toast.service';
@Component({
  selector: 'app-resource',
  templateUrl: './resource.page.html',
  styleUrls: ['./resource.page.scss'],
})
export class ResourcePage implements OnInit {

  showSearch: boolean = false;
  items: resourceData[] = [];
  skip: number = 0;
  searchQuery: string = '';

  resourceData: resourceData | undefined;
  isModalOpen: boolean = false;
  modelType!: string;


  @ViewChild('add') add !: AddResourceComponent;

  constructor(private resourceService: ResourceService, private modalCtrl: ModalController, private toastService: ToastService) { }

  ngOnInit() {
    this.getResources(this.skip, 20, this.searchQuery);
  }

  saveForm() {
    if (this.add.isFormValid()) {
      this.addEditCall(this.resourceData)
        .subscribe(() => {
          this.resourceData = undefined;
          this.modelType = false ? 'save' : 'edit';
          this.isModalOpen = false;
          this.items = [];
          this.skip = 0;
          this.getResources(this.skip, 20, this.searchQuery);
        });
    } else {
      this.add.addform.markAllAsTouched();
    }
  }

  addEditCall(editData: resourceData | undefined) {
    if (editData) {
      return this.resourceService.updateResource(this.add.addform.value)
    } else {
      return this.resourceService.addresource(this.add.addform.value)
    }
  }
  async openExportModel() {
    this.resourceService.getResourceAllData().subscribe(async (res: resourceResponse) => {
      const pdfTableData = res.data.resourceInfo.map((item: resourceData) => {
        return [
          item.name || '',
          item.email_id || '',
          item.mobile_no || '',
          item.experience || '',
          item.source || '',
          item.partner_name ? item.partner_name : '',
          item.type || '',
          item.profile_location || '',
          item.current_organisation || '',
          item.current_org_duration || '',
          item.ctc || '',
          item.ectc || '',
          item.preferred_location_name || '',
          item.work_location_name || '',
          item.current_location_name || '',
          item.notice_period || '',
          item.earliest_joining_date || '',
          item.reason_for_change || '',
          item.created_by || '',
          item.updated_by || '',
        ];
      });
      const pdfHeader = ["Name", "Email", "Mobile", "Experience", "Source", "Partner Name", "Type", "Profile Location", "Current Organisation", "Current Org Duration", "CTC", "ECTC",
        "Preferred Location", "Work Location", "Current Location", "Notice Period", "Earliest Joining Date", "Reason for Change", "Created By", "Updated By"];
      //pdf header details
      let req = {
        filename: 'resource',
        data: res.data.resourceInfo,
        pdfData: pdfTableData,
        pdfHeader: pdfHeader,
        title: 'Resource Report',
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
    this.getResources(this.skip, 20, this.searchQuery);
  }


  private getResources(skip: number, limit: number, search: string) {
    this.resourceService.getResources(skip, limit, search)
      .subscribe((data: resourceResponse) => {
        if(data.data.resourceInfo.length==0 && skip>0){
          this.skip= skip-20;
        }
        this.items = [...this.items, ...data.data.resourceInfo];
      });

  }

  private deleteResource(id: number, index: number) {
    this.resourceService.deleteResource(id).subscribe({
      next: (response: deleteResourceResponce) => {
        this.toastService.presentToast(response?.message)
        this.modalCtrl.dismiss();
        this.items.splice(index, 1);
      },
      error: (response) => {
        this.toastService.errorToast(response.message)
      },
    });
  }

  onIonInfinite(ev: any) {
    this.skip = this.skip + 20;
    this.getResources(this.skip, 20, this.searchQuery);
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  async deleteModal(item: resourceData, index: number, sliding: IonItemSliding) {
    let data = {
      "from": "Resource",
      "type": "Delete",
      "value": item.name
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
        this.deleteResource(item.resource_id, index);
      }
    });

    modal.onDidDismiss().then((_ => {
      mySubject.unsubscribe();
    }));
    sliding.close();
  }


  detailData(info: resourceData, type: string) {
    this.resourceData = info;
    this.modelType = type;
    this.isModalOpen = true;
  }
  setOpen(isOpen: boolean) {
    this.resourceData = undefined;
    this.modelType = isOpen ? 'save' : 'edit';
    this.isModalOpen = isOpen;
  }

  async backForm(modelType: string) {
    if (modelType == 'save') {
      let data = {
        "from": "Resource",
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
          this.resourceData = undefined;
          this.modelType = false ? 'save' : 'edit';
          this.isModalOpen = false;
          modal.dismiss();
        }
      });

      modal.onDidDismiss().then((_ => {
        mySubject.unsubscribe();
      }));
    } else {
      this.resourceData = undefined;
      this.modelType = false ? 'save' : 'edit';
      this.isModalOpen = false;
    }
  }
  editEvent(type: string) {
    this.modelType = type;
  }
}
