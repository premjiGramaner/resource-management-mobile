import { Component, OnInit, ViewChild } from '@angular/core';
import { ResourceRequirementService } from './services/resource-requirement.service';
import {
  InfiniteScrollCustomEvent,
  IonItemSliding,
  ModalController,
} from '@ionic/angular';
import { ToastConstants } from 'src/app/core/constant/toast.message.constant';
import { ToastService } from 'src/app/core/toast/toast.service';
import { DeleteNavComponent } from 'src/app/shared/components/delete-nav/delete-nav.component';
import { BehaviorSubject } from 'rxjs';
import { AddResourceRequirementComponent } from './add-resource-requirement/add-resource-requirement.component';
import { Status } from 'src/app/core/enum/status.enum';
import { Common, Modules } from 'src/app/core/enum/static.enum';
import {
  ResourceResponse,
  deleteResponce,
  editResourceRequest,
  postResourceRequest,
  viewResourceData,
} from './models/resource-requirement-model';
import { ExportOptionComponent } from 'src/app/shared/components/export-option/export-option.component';
import { DateformatConverterPipe } from 'src/app/shared/helpers/pipes/dateformat-converter.pipe';

@Component({
  selector: 'app-resource-requirement',
  templateUrl: './resource-requirement.page.html',
  styleUrls: ['./resource-requirement.page.scss'],
})
export class ResourceRequirementPage implements OnInit {
  showSearch: boolean = false;
  skip: number = 0;
  searchQuery: string = '';
  isModalOpen: boolean = false;
  modelType!: string;
  selectedIndex: number = 0;
  resourceData: postResourceRequest[] = [];
  resourceEdit: boolean = false;
  isEnableEdit: boolean = false;
  resourceMoreData!: viewResourceData;
  @ViewChild('addResource') addResource!: AddResourceRequirementComponent;
  constructor(
    private resourceRequirementService: ResourceRequirementService,
    private toastService: ToastService,
    private modalCtrl: ModalController,
    private toastConstants: ToastConstants,
    private dateformatConverterPipe: DateformatConverterPipe
  ) { }

  ngOnInit() {
    this.getResource(this.skip, 20, this.searchQuery);
  }

  saveResourceForm() {
    if (this.addResource.isPartnerFormValid()) {
      let addResourceRequest: postResourceRequest = {
        Requirement_requirement_id: this.addResource.resourceForm.value.Requirement_requirement_id,
        evaluated_by: this.addResource.resourceForm.value.evaluated_by,
        resources: this.addResource.resourceForm.value.resources,
        evaluated_date: this.dateformatConverterPipe.transform(
          this.addResource.resourceForm.value.evaluated_date
        ) as string,
        comments: this.addResource.resourceForm.value.comments,
      };
      if (!this.resourceEdit) {
        this.resourceRequirementService
          .postResource(addResourceRequest)
          .subscribe((res: Object) => {
            let response = res as ResourceResponse;
            this.toastService.presentToast(response.message);
            this.UpdateDataSet();
            this.isModalOpen = false;
          });
      } else {
        addResourceRequest['Resource_requirement_id'] =
          this.resourceMoreData.Resource_requirement_id;
        this.resourceRequirementService
          .editResource(addResourceRequest as editResourceRequest)
          .subscribe((res: Object) => {
            let response = res as ResourceResponse;
            this.toastService.presentToast(response.message);
            this.UpdateDataSet();
            this.isModalOpen = false;
          });
      }
    }
  }

  onSearch() {
    this.showSearch = !this.showSearch;
  }

  getAllResource() {
    this.resourceRequirementService
      .getAllResource()
      .subscribe((data: ResourceResponse) => {
        this.resourceData = [
          ...this.resourceData,
          ...data.data.resourceRequirementInfo,
        ];
      });
  }

  getResource(skip: number, limit: number, search: string) {
    this.resourceRequirementService
      .getResource(skip, limit, search)
      .subscribe((data: ResourceResponse) => {
        this.resourceData = [
          ...this.resourceData,
          ...data.data.resourceRequirementInfo,
        ];
      });
  }

  UpdateDataSet() {
    this.resourceData = [];
    this.getResource(this.skip, 20, this.searchQuery);
  }

  handleSearch(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
    this.resourceData = [];
    this.skip = 0;
    this.getResource(this.skip, 20, this.searchQuery);
  }

  onIonInfinite(ev: any) {
    this.skip = this.skip + 20;
    this.getResource(this.skip, 20, this.searchQuery);
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  enableEdit() {
    this.resourceEdit = true;
    this.modelType = Status.SAVE.toLowerCase();
  }

  async backForm(modelType: string) {
    if (modelType == Status.SAVE.toLowerCase() || this.resourceEdit) {
      let data = {
        from: Modules.Resource_requirement,
        type: Common.Discard,
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
          this.modelType = Status.SAVE.toLowerCase();
          this.isModalOpen = false;
          modal.dismiss();
          this.skip = 0;
          this.resourceData = [];
          this.getResource(this.skip, 20, this.searchQuery);
        }
      });
      modal.onDidDismiss().then((_) => {
        mySubject.unsubscribe();
      });
    } else {
      this.isModalOpen = false;
    }
  }

  async deleteModal(
    item: postResourceRequest,
    index: number,
    sliding: IonItemSliding
  ) {
    let data = {
      from: Modules.Resource_requirement,
      type: Common.Delete,
      value: item.requirement,
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
        this.deleteData(item.Resource_requirement_id as number, index);
        modal.dismiss();
      }
    });

    modal.onDidDismiss().then((_) => {
      mySubject.unsubscribe();
    });
    sliding.close();
  }

  deleteData(id: number, index: number) {
    this.resourceRequirementService.deleteResource(id).subscribe({
      next: (response: deleteResponce) => {
        this.resourceData.splice(index, 1);
        this.toastService.presentToast(
          this.toastConstants.Delete_success_message
        );
      },
      error: (response) => {
        this.toastService.errorToast(response.message);
      },
    });
  }

  setOpen(isOpen: boolean, type: string, skillInfo?: object, index?: number) {
    this.modelType = type;
    this.isModalOpen = isOpen;
    this.resourceEdit = false;
    this.selectedIndex = index as number;
    this.resourceMoreData = skillInfo as viewResourceData;
  }

  async openExportModel() {
    this.resourceRequirementService
      .getAllResource()
      .subscribe(async (res: ResourceResponse) => {
        const keyToRemove = [
          'Requirement_requirement_id',
          'Resource_requirement_id',
        ];
        const newArray = res.data.resourceRequirementInfo.map(
          (obj: viewResourceData) => {
            const newObj = { ...obj };
            keyToRemove.map((item) => {
              delete newObj[item as keyof viewResourceData];
            });
            return newObj;
          }
        );
        const pdfTableData = newArray.map((item: viewResourceData) => {
          return [
            item.comments || '',
            item.evaluated_by || '',
            item.evaluated_by_name || '',
            item.evaluated_date || '',
            item.requirement || '',
          ];
        });
        let keys = Object.keys(newArray[0]);
        let elementToRemove = 'ResourceRequirementMappings';
        let pdfHeader = keys.reduce((result: Array<string>, item: string) => {
          if (item !== elementToRemove) {
            result.push(item.split('_').join('').toUpperCase());
          }
          return result;
        }, []);
        //pdf header details
        let req = {
          filename: Modules.Resource_requirement,
          data: res.data.resourceRequirementInfo,
          pdfData: pdfTableData,
          pdfHeader: pdfHeader,
          title: `${Modules.Resource_requirement} PDF Report`,
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
