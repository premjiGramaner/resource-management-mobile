import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { ToastConstants } from 'src/app/core/constant/toast.message.constant';
import { ToastService } from 'src/app/core/toast/toast.service';
import {
  partnerResponce,
  skillResponce,
} from '../partner/models/partner.model';
import { SkillService } from './services/skill.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { DeleteNavComponent } from 'src/app/shared/components/delete-nav/delete-nav.component';
import { ExportOptionComponent } from 'src/app/shared/components/export-option/export-option.component';
import { skillData, skillPostResponce } from './models/skill.model';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.page.html',
  styleUrls: ['./skill.page.scss'],
})
export class SkillPage implements OnInit {
  skillData: skillData[] = [];
  showSearch: boolean = false;
  skip: number = 0;
  searchQuery: string = '';
  isModalOpen: boolean = false;
  modelType!: string;
  skillForm!: FormGroup;
  skillEdit: boolean = false;
  isEnableEdit: boolean = false;
  selectedIndex: number = 0;
  skillMoreData!: skillData;
  constructor(
    private skillService: SkillService,
    private toastService: ToastService,
    private modalCtrl: ModalController,
    private toastConstants: ToastConstants
  ) { }

  ngOnInit() {
    this.getSkill(this.skip, 20, this.searchQuery);
    this.skillForm = new FormGroup({
      category: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
  }

  getSkill(skip: number, limit: number, search: string) {
    this.skillService.getSkill(skip, limit, search).subscribe((data: any) => {
      this.skillData = [...this.skillData, ...data.data.skillInfo];
    });
  }

  handleSearch(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
    this.skillData = [];
    this.skip = 0;
    this.getSkill(this.skip, 20, this.searchQuery);
  }

  onSearch() {
    this.showSearch = !this.showSearch;
  }

  setOpen(isOpen: boolean, type: string, skillInfo?: any, index?: any) {
    this.modelType = type;
    this.isModalOpen = isOpen;
    this.selectedIndex = index;
    this.setDataSkillForm(skillInfo);
  }

  setDataSkillForm(skillInfo: any) {
    if (skillInfo != undefined) {
      this.isEnableEdit = true;
      this.skillMoreData = skillInfo;
      this.skillForm.patchValue({
        category: skillInfo.category,
        description: skillInfo.description,
      });
    } else {
      this.isEnableEdit = false;
      this.skillEdit = false;
      this.skillForm.reset();
    }
  }

  onIonInfinite(ev: any) {
    this.skip = this.skip + 20;
    this.getSkill(this.skip, 20, this.searchQuery);
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  async backForm(modelType: string) {
    if (modelType == 'save' || this.skillEdit) {
      let data = {
        from: 'Skill',
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

  enableEdit() {
    this.skillEdit = true;
    this.modelType = 'save';
    this.isEnableEdit = false;
  }

  savePartnerForm() {
    if (!this.skillEdit) {
      this.skillService.postSkill(this.skillForm.value).subscribe((res) => {
        const skillResponse = res as skillPostResponce;
        this.toastService.presentToast(skillResponse.message);
        // save data to local array
        this.skillData.unshift(this.skillForm.value);
      });
    } else {
      let updateReq = this.skillForm.value;
      updateReq['skill_id'] = this.skillMoreData.skill_id;
      this.skillService.editSkill(updateReq).subscribe((res: any) => {
        const skillResponse = res as skillPostResponce;
        this.toastService.presentToast(skillResponse.message);
        // save data to local array
        this.skillData.splice(this.selectedIndex, 1);
        this.skillData.unshift(this.skillForm.value);
      });
    }
  }

  async openExportModel() {
    this.skillService.getAllSkill().subscribe(async (res: skillResponce) => {
      const keyToRemove = ['skill_id'];
      const newArray = res.data.skillInfo.map((obj: any) => {
        const newObj = { ...obj };
        keyToRemove.map((item) => {
          delete newObj[item];
        });
        return newObj;
      });
      const pdfTableData = newArray.map((item: any) => {
        return [item.category || '', item.description || ''];
      });
      let keys = Object.keys(newArray[0]);
      let elementToRemove = 'skill_id';
      let pdfHeader = keys.reduce((result: any, item: any) => {
        if (item !== elementToRemove) {
          result.push(item.split('_').join('').toUpperCase());
        }
        return result;
      }, []);
      //pdf header details
      let req = {
        filename: 'skill',
        data: res.data.skillInfo,
        pdfData: pdfTableData,
        pdfHeader: pdfHeader,
        title: 'Partner PDF Report',
        size: [300, 200],
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

  async deleteModal(item: any, index: any, sliding: any) {
    let data = {
      from: 'Skill',
      type: 'Delete',
      value: item.category,
    };
    const mySubject = new BehaviorSubject(data);
    const modal = await this.modalCtrl.create({
      component: DeleteNavComponent,
      breakpoints: [0, 0.5, 1],
      initialBreakpoint: 0.4,
      handle: false,
      componentProps: {
        mySubject,
      },
    });
    await modal.present();

    mySubject.subscribe((value: any) => {
      if (value == true) {
        this.deleteClient(item.skill_id, index);
      }
    });

    modal.onDidDismiss().then((_) => {
      mySubject.unsubscribe();
    });
    sliding.close();
  }

  deleteClient(id: string, index: number) {
    this.skillService.deleteSkill(id).subscribe({
      next: (response: any) => {
        this.skillData.splice(index, 1);
        this.toastService.presentToast(
          this.toastConstants.Delete_success_message
        );
      },
      error: (response) => {
        this.toastService.presentToast(this.toastConstants.try_again);
      },
    });
  }
}
