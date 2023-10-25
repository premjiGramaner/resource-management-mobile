import { Component, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController, ToastController } from '@ionic/angular';
import { RequirementService } from './services/requirement.service';
import { requiementData, requirementResponse } from './models/requirement.model';
import { BehaviorSubject } from 'rxjs';
import { DeleteNavComponent } from 'src/app/shared/components/delete-nav/delete-nav.component';
import { ExportOptionComponent } from 'src/app/shared/components/export-option/export-option.component';
import { AddRequirementComponent } from './add-requirement/add-requirement.component';

@Component({
  selector: 'app-requirement',
  templateUrl: './requirement.page.html',
  styleUrls: ['./requirement.page.scss'],
})
export class RequirementPage implements OnInit {

  showSearch: boolean = false;
  items: any = [];
  skip: number = 0;
  searchQuery: string = '';

  requirementData: any;
  isModalOpen: boolean = false;
  modelType!: string;

  @ViewChild('add') add !: AddRequirementComponent;

  constructor(private requirementService: RequirementService, private modalCtrl: ModalController, private toastController: ToastController) { }

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
      const pdfHeader = ["Name", "Client", "SPOC", "Experience","Location", "Source", "Priority", "Hire Budget", "Contract Budget", "Notice Period", "Duration", "JD", "Status", "Created By", "Updated By"];
      //pdf header details
      let req = {
        filename: 'requirement',
        data: res.data.requirementInfo,
        pdfData: pdfTableData,
        pdfHeader: pdfHeader,
        title: 'Requirement Report',
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
        this.items = [...this.items, ...data.data.requirementInfo];
      });
  }

  private deleteRequirement(id: string, index: number) {
    this.requirementService.deleteRequirement(id).subscribe({
      next: (response: any) => {
        this.presentToast(response?.message)
        this.modalCtrl.dismiss();
        this.items.splice(index, 1);
      },
      error: (response) => {
        this.presentToast(response.message)
      },
    });
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'top'
    });

    await toast.present();
  }

  onIonInfinite(ev: any) {
    this.skip = this.skip + 20;
    this.getRequirements(this.skip, 20, this.searchQuery);
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  async deleteModal(item: any, index: number, sliding: any) {
    let data = {
      "from": "Requirement",
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
        this.deleteRequirement(item.requirement_id, index);
      }
    });

    modal.onDidDismiss().then((_ => {
      mySubject.unsubscribe();
    }));
    sliding.close();
  }


  detailData(info: any, type: string) {
    this.requirementData = info;
    this.modelType = type;
    this.isModalOpen = true;
  }
  setOpen(isOpen: boolean) {
    this.requirementData = undefined;
    this.modelType = isOpen ? 'save' : 'edit';
    this.isModalOpen = isOpen;
  }

  async backForm(modelType: string) {
    if (modelType == 'save') {
      let data = {
        "from": "Requirement",
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
          this.requirementData = undefined;
          this.modelType = false ? 'save' : 'edit';
          this.isModalOpen = false;
          modal.dismiss();
        }
      });

      modal.onDidDismiss().then((_ => {
        mySubject.unsubscribe();
      }));
    } else {
      this.requirementData = undefined;
      this.modelType = false ? 'save' : 'edit';
      this.isModalOpen = false;
    }
  }


  saveForm() {
    if (this.add.isFormValid()) {
      this.addEditCall(this.requirementData)
        .subscribe((data: any) => {
          this.add.setClose();
          this.items = [];
          this.getRequirements(this.skip, 20, this.searchQuery);
        });
    } else {
      this.add.addform.markAllAsTouched();
    }
  }

  addEditCall(editData: any) {
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
