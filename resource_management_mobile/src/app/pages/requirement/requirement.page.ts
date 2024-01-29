import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  InfiniteScrollCustomEvent,
  IonItemSliding,
  ModalController,
} from '@ionic/angular';
import { RequirementService } from './services/requirement.service';
import {
  deleteRequirementResponse,
  requiementData,
  requirementResponse,
} from './models/requirement.model';
import { BehaviorSubject, map } from 'rxjs';
import { DeleteNavComponent } from 'src/app/shared/components/delete-nav/delete-nav.component';
import { ExportOptionComponent } from 'src/app/shared/components/export-option/export-option.component';
import { AddRequirementComponent } from './add-requirement/add-requirement.component';
import { ToastService } from 'src/app/core/toast/toast.service';
import { Common, Modules } from 'src/app/core/enum/static.enum';
import { Status } from 'src/app/core/enum/status.enum';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { RouteConstants } from 'src/app/core/constant/routes.constants';
import { ClientService } from '../client/service/client.service';
import { ClientArrayData, clientResponce } from '../client/models/client.model';
import { ToastConstants } from 'src/app/core/constant/toast.message.constant';
import {
  ResourceResponse,
  editResourceRequest,
  postResourceRequest,
  viewResourceData,
} from '../resource-requirement/models/resource-requirement-model';
import { ResourceRequirementPage } from '../resource-requirement/resource-requirement.page';
import { AddResourceRequirementComponent } from '../resource-requirement/add-resource-requirement/add-resource-requirement.component';
import { ResourceRequirementService } from '../resource-requirement/services/resource-requirement.service';
import { DateformatConverterPipe } from 'src/app/shared/helpers/pipes/dateformat-converter.pipe';

@Component({
  selector: 'app-requirement',
  templateUrl: './requirement.page.html',
  styleUrls: ['./requirement.page.scss'],
})
export class RequirementPage implements OnInit {
  showSearch: boolean = false;
  items: requiementData[] = [];
  skip: number = 0;
  searchQuery: string = '';

  requirementData: requiementData | undefined;
  isModalOpen: boolean = false;
  isViewResourceModalOpen: boolean = false;
  modelType!: string;
  client_Id: number[] = [];
  filterBasedClient_Id: number[] = [];
  clientData: ClientArrayData[] = [];
  @ViewChild('add') add!: AddRequirementComponent;
  @ViewChild('addResource') addResource!: AddResourceRequirementComponent;
  @ViewChild('popover') popover: any;
  isOpen = false;
  clientId: number[] = [];
  resourceMoreData!: viewResourceData;
  resourceEdit: boolean = false;

  constructor(
    private requirementService: RequirementService,
    private modalCtrl: ModalController,
    private toastService: ToastService,
    private staticData: StaticDataConstants,
    private router: Router,
    private routerState: ActivatedRoute,
    private routeConstants: RouteConstants,
    private clientService: ClientService,
    private resourceRequirementService: ResourceRequirementService,
    private dateformatConverterPipe: DateformatConverterPipe,
    protected toastConstants: ToastConstants
  ) { }

  ngOnInit() {
    this.routerState.paramMap
      .pipe(map(() => window.history.state))
      .subscribe((res) => {
        this.client_Id = [];
        this.items = [];
        if (res.data != undefined) {
          this.client_Id.push(res.data);
        } else {
          this.client_Id = [];
        }
        this.getRequirements(this.skip, 20, this.searchQuery, this.client_Id);
      });
  }

  async openExportModel() {
    this.requirementService
      .getRequirementAllData()
      .subscribe(async (res: requirementResponse) => {
        const pdfTableData = res.data.requirementInfo.map(
          (item: requiementData) => {
            return [
              item.name || '',
              item.client_name || '',
              item.SPOC_name || '',
              item.experience || '',
              item.Location_Location_Name || '',
              item.source_mode || '',
              item.priority || '',
              item.hire_budget || '',
              item.contract_budget || '',
              item.notice_period || '',
              item.duration || '',
              item.jd || '',
              item.status_name || '',
              item.created_by || '',
              item.updated_by || '',
            ];
          }
        );
        const pdfHeader = this.staticData.requirement_report_header;
        //pdf header details
        let req = {
          filename: Modules.Requirement.toLowerCase(),
          data: res.data.requirementInfo,
          pdfData: pdfTableData,
          pdfHeader: pdfHeader,
          title: Modules.Requirement + ' ' + Common.report,
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
        modal.onDidDismiss().then((_) => { });
      });
  }

  onSearch() {
    this.showSearch = !this.showSearch;
  }

  handleSearch(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
    this.items = [];
    this.skip = 0;
    this.getRequirements(this.skip, 20, this.searchQuery, this.client_Id);
  }

  private getRequirements(
    skip: number,
    limit: number,
    search: string,
    client_Id?: number[]
  ) {
    if (client_Id == undefined) {
      client_Id = []
    }
    this.requirementService
      .getRequirement(skip, limit, search, client_Id!)
      .subscribe((data: requirementResponse) => {
        if (data.data.requirementInfo.length == 0 && skip > 0) {
          this.skip = skip - 20;
        }
        this.items = [...this.items, ...data.data.requirementInfo];
      });
  }

  private deleteRequirement(id: number, index: number) {
    this.requirementService.deleteRequirement(id).subscribe({
      next: (response: deleteRequirementResponse) => {
        this.toastService.presentToast(response?.message);
        this.modalCtrl.dismiss();
        this.items.splice(index, 1);
      },
      error: (response) => {
        this.toastService.errorToast(response.message);
      },
    });
  }

  onIonInfinite(ev: any) {
    this.skip = this.skip + 20;
    this.getRequirements(this.skip, 20, this.searchQuery, this.client_Id);
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  async deleteModal(
    item: requiementData,
    index: number,
    sliding: IonItemSliding
  ) {
    let data = {
      from: Modules.Requirement,
      type: Common.Delete,
      value: item.name,
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
        this.deleteRequirement(item.requirement_id, index);
      }
    });

    modal.onDidDismiss().then((_) => {
      mySubject.unsubscribe();
    });
    sliding.close();
  }

  detailData(info: requiementData, type: string) {
    this.requirementData = info;
    this.modelType = type;
    this.isModalOpen = true;
  }

  setOpen(isOpen: boolean) {
    this.requirementData = undefined;
    this.modelType = isOpen ? Status.SAVE : Status.EDIT;
    this.isModalOpen = isOpen;
  }

  async backForm(modelType: string) {
    if (modelType == Status.SAVE) {
      let data = {
        from: Modules.Requirement,
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
          this.requirementData = undefined;
          this.modelType = false ? Status.SAVE : Status.EDIT;
          this.isModalOpen = false;
          modal.dismiss();
        }
      });

      modal.onDidDismiss().then((_) => {
        mySubject.unsubscribe();
      });
    } else {
      this.requirementData = undefined;
      this.modelType = false ? Status.SAVE : Status.EDIT;
      this.isModalOpen = false;
    }
  }

  saveForm() {
    if (this.add.isFormValid()) {
      this.addEditCall(this.requirementData).subscribe(() => {
        this.requirementData = undefined;
        this.modelType = false ? Status.SAVE : Status.EDIT;
        this.isModalOpen = false;
        this.items = [];
        this.skip = 0;
        this.getRequirements(this.skip, 20, this.searchQuery);
      });
    } else {
      this.add.addform.markAllAsTouched();
    }
  }

  addEditCall(editData: requiementData | undefined) {
    if (editData) {
      return this.requirementService.updateRequirement(this.add.addform.value);
    } else {
      return this.requirementService.addRequirement(this.add.addform.value);
    }
  }

  editEvent(type: string) {
    this.modelType = type;
  }

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  resourceNavigation() {
    this.isModalOpen = false;
    this.isOpen = false;
    const navigationExtras: NavigationExtras = {
      state: { data: this.requirementData, clearHistory: true },
    };
    setTimeout(() => {
      this.router.navigate([this.routeConstants.resource], navigationExtras);
    });
  }

  resourceRequirementNavigation() {
    this.isModalOpen = false;
    this.isOpen = false;
    const id = this.requirementData?.requirement_id!;
    /**
     * response contain dynamic key values
     */
    this.requirementService
      .getResourceRquirementById(id)
      .subscribe((response: any) => {
        if (response.data.resourceRequirementInfo) {
          this.resourceMoreData = response.data.resourceRequirementInfo;
          this.isViewResourceModalOpen = true;
        } else {
          this.toastService.errorToast(response.message);
        }
      });
  }

  openClientFilter() {
    this.clientService
      .getClientAllData()
      .subscribe(async (res: clientResponce) => {
        this.clientData = res.data.clientInfo;
        if (this.filterBasedClient_Id.length != 0) {
          this.filterBasedClient_Id.map((item) => {
            this.clientData.map((client: ClientArrayData) => {
              if (client.client_id == item) {
                client.checked = true;
              }
            });
          });
        }
      });
  }

  getClientId(event: any, id: any) {
    id = id as number;
    if (event.target.checked) {
      this.filterBasedClient_Id.push(id);
    } else {
      const index = this.filterBasedClient_Id.findIndex(
        (item: number) => item == id
      );
      this.filterBasedClient_Id.splice(index, 1);
    }
  }

  canDismiss(data?: any, role?: string) {
    return role !== 'gesture';
  }

  applyClientFilter() {
    if (this.filterBasedClient_Id) {
      this.items = [];
      this.getRequirements(
        this.skip,
        20,
        this.searchQuery,
        this.filterBasedClient_Id
      );
      this.modalCtrl.dismiss();
    }
  }

  onRefresh() {
    this.filterBasedClient_Id = [];
    this.items = [];
    this.getRequirements(this.skip, 20, this.searchQuery, this.client_Id);
    this.modalCtrl.dismiss();
  }

  backResourceRequirementForm(modelType: string) {
    this.isViewResourceModalOpen = false;
  }

  enableEdit() {
    this.resourceEdit = true;
    this.modelType = Status.SAVE.toLowerCase();
  }

  saveResourceForm() {
    if (this.addResource.isPartnerFormValid()) {
      let addResourceRequest: postResourceRequest = {
        Requirement_requirement_id:
          this.addResource.resourceForm.value.Requirement_requirement_id,
        evaluated_by: this.addResource.resourceForm.value.evaluated_by,
        resources: this.addResource.resourceForm.value.resources,
        evaluated_date: this.dateformatConverterPipe.transform(
          this.addResource.resourceForm.value.evaluated_date
        ) as string,
        comments: this.addResource.resourceForm.value.comments,
      };
      if (this.resourceEdit) {
        addResourceRequest['Resource_requirement_id'] =
          this.resourceMoreData.Resource_requirement_id;
        this.resourceRequirementService
          .editResource(addResourceRequest as editResourceRequest)
          .subscribe((res: Object) => {
            let response = res as ResourceResponse;
            this.toastService.presentToast(response.message);
            this.resourceEdit = false;
            this.isViewResourceModalOpen = false;
          });
      }
    }
  }
}
