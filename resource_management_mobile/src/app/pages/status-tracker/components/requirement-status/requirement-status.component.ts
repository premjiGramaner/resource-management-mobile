import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, IonItemSliding, ModalController } from '@ionic/angular';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';
import { Status } from 'src/app/core/enum/status.enum';
import { ToastService } from 'src/app/core/toast/toast.service';
import { adminRequirementData, adminResourceRequirementResponse, updateStatus, updateStatusResponse } from 'src/app/pages/resource-requirement/models/resource-requirement-model';
import { ResourceRequirementService } from 'src/app/pages/resource-requirement/services/resource-requirement.service';

@Component({
  selector: 'app-requirement-status',
  templateUrl: './requirement-status.component.html',
  styleUrls: ['./requirement-status.component.scss'],
})
export class RequirementStatusComponent implements OnInit {

  showSearch: boolean = false;
  items: adminRequirementData[] = [];
  skip: number = 0;
  searchQuery: string = '';

  requirementData: adminRequirementData | undefined;
  isModalOpen: boolean = false;
  isChangeOpen: boolean = false;
  modelType!: string;

  requirementItem: adminRequirementData | undefined;

  constructor(private adminRequirement: ResourceRequirementService, private modalCtrl: ModalController, private toastService: ToastService, private statisConstants: StaticDataConstants) { }

  ngOnInit() {
    this.getRequirementList(this.skip, 20, this.searchQuery);
  }

  onSearch() {
    this.showSearch = !this.showSearch;
  }

  colorByStatus(item: adminRequirementData) {
    switch (item.Status_status_id) {
      case 1:
        return "warning";
        break;
      case 2:
        return "secondary";
        break;
      case 3:
        return "Notifications";
        break;
      case 4:
        return "Completed";
        break;
      default:
        return undefined;
      // code block
    }
  }
  handleSearch(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
    this.items = [];
    this.skip = 0;
    this.getRequirementList(this.skip, 20, this.searchQuery);
  }


  private getRequirementList(skip: number, limit: number, search: string) {
    this.adminRequirement.getAdminResourceRequirement(skip, limit, search)
      .subscribe((data: adminResourceRequirementResponse) => {
        if (data.data.resourceRequirementMappings.length == 0 && skip > 0) {
          this.skip = skip - 20;
        }
        this.items = [...this.items, ...data.data.resourceRequirementMappings];
      });

  }

  onIonInfinite(ev: any) {
    this.skip = this.skip + 20;
    this.getRequirementList(this.skip, 20, this.searchQuery);
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  changeModal(item: adminRequirementData, index: number, sliding: IonItemSliding) {
    this.isChangeOpen = true;
    this.requirementItem = item;
    sliding.close();
  }

  changeStatus(form: updateStatus) {
    this.adminRequirement.updateResourceRequirement(form)
      .subscribe({
        next: (response: updateStatusResponse) => {
          this.toastService.presentToast(response?.message)
          this.requirementItem = undefined;
          this.isChangeOpen = false;
          this.items = [];
          this.skip = 0;
          this.getRequirementList(this.skip, 20, this.searchQuery);
        },
        error: (response) => {
          this.toastService.errorToast(response.message)
        },

      });
  }

  closeStatus() {
    this.isChangeOpen = false;
    this.requirementItem = undefined;
  }

  detailData(info: adminRequirementData, type: string) {
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
    this.requirementData = undefined;
    this.modelType = false ? Status.SAVE : Status.EDIT;
    this.isModalOpen = false;
  }

}
