import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Status } from 'src/app/core/enum/status.enum';
import { ClientService } from '../service/client.service';
import { ToastService } from 'src/app/core/toast/toast.service';
import { ModalController } from '@ionic/angular';
import { DeleteNavComponent } from 'src/app/shared/components/delete-nav/delete-nav.component';
import { BehaviorSubject } from 'rxjs';
import { DuplicateRemoverPipe } from 'src/app/shared/helpers/pipes/duplicate-remover.pipe';
import { ClientArrayData, UserInfo, skill } from '../models/client.model';
import { ToastConstants } from 'src/app/core/constant/toast.message.constant';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss'],
})
export class AddClientComponent implements OnInit {
  clientForm!: FormGroup;
  @Output() childFormSubmitted = new EventEmitter<FormGroup>();
  @Input() viewClientData!: ClientArrayData;
  @Input() flag!: string;
  onSubmit: boolean = true;
  userList: UserInfo[] = [];
  skillList: skill[] = [];
  selectedSkillIds: skill[] = [];
  skilId: any;
  isModalOpen = false;
  constructor(
    private clientService: ClientService,
    private toastService: ToastService,
    private modalController: ModalController,
    private fb: FormBuilder,
    private removeDuplicate: DuplicateRemoverPipe,
    private toastConstants: ToastConstants
  ) { }

  ngOnInit() {
    this.clientForm = new FormGroup({
      name: new FormControl('', Validators.required),
      contact_person_name: new FormControl('', Validators.required),
      contact_person_email_id: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      contact_person_phone: new FormControl('', Validators.required),
      ownership_id: new FormControl(''),
      sales_person_name: new FormControl(''),
      sales_person_email_id: new FormControl('', [Validators.email]),
      sales_person_phone: new FormControl(''),
      finance_person_name: new FormControl(''),
      finance_person_email_id: new FormControl('', [Validators.email]),
      finance_person_phone: new FormControl(''),
      strength: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      skill_ids: this.fb.array([]),
      skill_id: new FormControl([]),
    });

    this.getUserList();
    this.getSkillList();
    this.showEditableData();
    if (this.flag.toLowerCase() == Status.SAVE.toLowerCase()) {
      this.clientForm.reset();
      this.selectedSkillIds = [];
    }
  }

  setClose() {
    this.modalController.dismiss();
  }

  showEditableData() {
    if (this.viewClientData != undefined) {
      this.clientForm.patchValue({
        name: this.viewClientData.name,
        contact_person_name: this.viewClientData.contact_person_name,
        contact_person_email_id: this.viewClientData.contact_person_email_id,
        contact_person_phone: this.viewClientData.contact_person_phone,
        ownership_id: '' + this.viewClientData.ownership_id,
        sales_person_name: this.viewClientData.sales_person_name,
        sales_person_email_id: this.viewClientData.sales_person_email_id,
        sales_person_phone: this.viewClientData.sales_person_phone,
        finance_person_name: this.viewClientData.finance_person_name,
        finance_person_email_id: this.viewClientData.finance_person_email_id,
        finance_person_phone: this.viewClientData.finance_person_phone,
        strength: this.viewClientData.strength,
        address: this.viewClientData.address,
      });

      /**Add data to the skill_ids */
      this.selectedSkillIds = this.removeDuplicate.transform(
        this.viewClientData.skills
      );
      const idsFormArray = this.clientForm.get('skill_ids') as FormArray;
      this.selectedSkillIds.map((item: any) => {
        idsFormArray.push(new FormControl(item.skill_id));
      });
    }
  }

  isClientFormValid() {
    if (this.clientForm.status == Status.INVALID) {
      this.onSubmit = false;
      return;
    }
    if (this.selectedSkillIds.length == 0) {
      this.toastService.presentToast(this.toastConstants.Invalid_Skill);
      return;
    }

    return this.clientForm.valid;
  }

  getUserList() {
    this.clientService.getUser().subscribe((res) => {
      this.userList = res.data.userInfo;
    });
  }

  getSkillList() {
    this.clientService.getSkill().subscribe((res) => {
      this.skillList = res.data.skillInfo;
    });
  }

  handleSkillChange() {
    this.skilId = this.skillList.find((i: any) => {
      return i.skill_id == this.clientForm.value.skill_id;
    });
  }

  primaryskill(event: any) {
    this.skilId['primary_skill'] = event.detail.checked;
  }

  addSkill() {
    if (this.skilId) {
      if (this.skilId?.primary_skill) {
        this.selectedSkillIds.unshift(this.skilId);
      } else {
        this.selectedSkillIds.push(this.skilId);
      }
    }
    const idsFormArray = this.clientForm.get('skill_ids') as FormArray;
    idsFormArray.push(new FormControl(this.clientForm.value.skill_id));
    this.modalController.dismiss();
    this.skilId = '';
  }

  deleteSkill(i: number) {
    this.selectedSkillIds.splice(i, 1);
  }

  async deleteModal(index: number) {
    let data = {
      from: 'Skill',
      type: 'Delete',
      value: 'data',
    };
    const mySubject = new BehaviorSubject(data);
    const modal = await this.modalController.create({
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
        this.deleteSkill(index);
      }
    });
    modal.onDidDismiss().then((_) => {
      mySubject.unsubscribe();
    });
  }
}
