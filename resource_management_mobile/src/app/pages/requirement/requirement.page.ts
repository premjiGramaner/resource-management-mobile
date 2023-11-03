import { Component, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, IonItemSliding, ModalController } from '@ionic/angular';
import { RequirementService } from './services/requirement.service';
import { deleteRequirementResponse, requiementData, requirementResponse } from './models/requirement.model';
import { BehaviorSubject } from 'rxjs';
import { DeleteNavComponent } from 'src/app/shared/components/delete-nav/delete-nav.component';
import { ExportOptionComponent } from 'src/app/shared/components/export-option/export-option.component';
import { AddRequirementComponent } from './add-requirement/add-requirement.component';
import { ToastService } from 'src/app/core/toast/toast.service';
import { Common, Requirement } from 'src/app/core/enum/static.enum';
import { Status } from 'src/app/core/enum/status.enum';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';

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

  @ViewChild('add') add !: AddRequirementComponent;

  constructor(private requirementService: RequirementService, private modalCtrl: ModalController, private toastService: ToastService, private staticData: StaticDataConstants) { }

  ngOnInit() {
    this.getRequirements(this.skip, 20, this.searchQuery);
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
        filename: Requirement.requirement,
        data: res.data.requirementInfo,
        pdfData: pdfTableData,
        pdfHeader: pdfHeader,
        title: Requirement.report_title,
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
    this.getRequirements(this.skip, 20, this.searchQuery);
  }

  private getRequirements(skip: number, limit: number, search: string) {
    this.requirementService.getRequirement(skip, limit, search)
      .subscribe((data: requirementResponse) => {
        if(data.data.requirementInfo.length==0 && skip>0){
          this.skip= skip-20;
        }
        this.items = [...this.items, ...data.data.requirementInfo];
      });
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
    this.getRequirements(this.skip, 20, this.searchQuery);
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  async deleteModal(item: requiementData, index: number, sliding: IonItemSliding) {
    let data = {
      from: Requirement.Requirement,
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
        from: Requirement.Requirement,
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

}
