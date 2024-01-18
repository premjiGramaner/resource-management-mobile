import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, IonItemSliding, ModalController } from '@ionic/angular';
import { RequirementService } from './services/requirement.service';
import { deleteRequirementResponse, requiementData, requirementResponse } from './models/requirement.model';
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
import { ClientArrayData } from '../client/models/client.model';

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
  modelType!: string;
  client_Id: number[] = [];
  filterBasedClient_Id: number[] = [];
  clientData: ClientArrayData[] = [];
  @ViewChild('add') add !: AddRequirementComponent;

  @ViewChild('popover') popover: any;
  isOpen = false;
  clientId: number[] = [];

  constructor(
    private requirementService: RequirementService,
    private modalCtrl: ModalController,
    private toastService: ToastService,
    private staticData: StaticDataConstants,
    private router: Router,
    private routerState: ActivatedRoute,
    private routeConstants: RouteConstants,
    private clientService: ClientService) { }

  ngOnInit() {

    this.routerState.paramMap
      .pipe(map(() => window.history.state))
      .subscribe((res: any) => {
        this.client_Id = [];
        this.items = [];
        if (res.data != undefined) {
          this.client_Id.push(res.data);
        } else {
          this.client_Id = [];
        }
        this.getRequirements(this.skip, 20, this.searchQuery, this.client_Id);
      })

  }

  async openExportModel() {
    this.requirementService.getRequirementAllData().subscribe(async (res: requirementResponse) => {
      const pdfTableData = res.data.requirementInfo.map((item: requiementData) => {
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
          item.updated_by || ''
        ];
      });
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
    this.getRequirements(this.skip, 20, this.searchQuery, this.client_Id);
  }

  private getRequirements(skip: number, limit: number, search: string, client_Id?: number[]) {
    console.log(skip, limit, search, client_Id)
    this.requirementService.getRequirement(skip, limit, search, client_Id!)
      .subscribe((data: requirementResponse) => {
        if (data.data.requirementInfo.length == 0 && skip > 0) {
          this.skip = skip - 20;
        }
        this.items = [...this.items, ...data.data.requirementInfo];
      });
    console.log(this.items)
  }


  private deleteRequirement(id: number, index: number) {
    this.requirementService.deleteRequirement(id).subscribe({
      next: (response: deleteRequirementResponse) => {
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
    console.log(this.client_Id)
    this.getRequirements(this.skip, 20, this.searchQuery, this.client_Id);
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  async deleteModal(item: requiementData, index: number, sliding: IonItemSliding) {
    let data = {
      from: Modules.Requirement,
      type: Common.Delete,
      value: item.name
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
        this.deleteRequirement(item.requirement_id, index);
      }
    });

    modal.onDidDismiss().then((_ => {
      mySubject.unsubscribe();
    }));
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
        value: ''
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
          this.requirementData = undefined;
          this.modelType = false ? Status.SAVE : Status.EDIT;
          this.isModalOpen = false;
          modal.dismiss();
        }
      });

      modal.onDidDismiss().then((_ => {
        mySubject.unsubscribe();
      }));
    } else {
      this.requirementData = undefined;
      this.modelType = false ? Status.SAVE : Status.EDIT;
      this.isModalOpen = false;
    }
  }


  saveForm() {
    if (this.add.isFormValid()) {
      this.addEditCall(this.requirementData)
        .subscribe(() => {
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
      return this.requirementService.updateRequirement(this.add.addform.value)
    } else {
      return this.requirementService.addRequirement(this.add.addform.value)
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
    const navigationExtras: NavigationExtras = { state: { data: this.requirementData, clearHistory: true } };
    setTimeout(() => {
      this.router.navigate([this.routeConstants.resource], navigationExtras)
    })
  }

  resourceRequirementNavigation() {
    this.isModalOpen = false;
    this.isOpen = false;
    const navigationExtras: NavigationExtras = { state: { data: this.requirementData, clearHistory: true } };
    setTimeout(() => {
      this.router.navigate([this.routeConstants.resource_requirement], navigationExtras)
    })
  }


  openClientFilter() {
    this.clientService.getClientAllData().subscribe(async (res: any) => {
      this.clientData = res.data.clientInfo;
      if (this.filterBasedClient_Id.length != 0) {
        this.filterBasedClient_Id.map((item) => {
          this.clientData.map((client: any) => {
            if (client.client_id == item) {
              client.checked = true
            }
          })
        })
      }
    })
  }

  getClientId(event: any, id: any) {
    id = id as number;
    if (event.target.checked) {
      this.filterBasedClient_Id.push(id);
    } else {
      const index = this.filterBasedClient_Id.findIndex((item: any) => item.client_id == id)
      this.filterBasedClient_Id.splice(index, 1);
    }
  }

  canDismiss(data?: any, role?: string) {
    console.log('trigger')
    return role !== 'gesture';
  }

  applyClientFilter() {
    console.log(this.filterBasedClient_Id)
    if (this.filterBasedClient_Id) {
      this.items = [];
      this.getRequirements(this.skip, 20, this.searchQuery, this.filterBasedClient_Id);
      this.modalCtrl.dismiss();
    }
  }

  onRefresh() {
    this.filterBasedClient_Id = [];
    this.items = [];
    this.getRequirements(this.skip, 20, this.searchQuery, this.client_Id);
    this.modalCtrl.dismiss();
  }
}
