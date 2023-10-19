import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss'],
})
export class AddClientComponent implements OnInit {
  clientForm!: FormGroup;
  @Output() childFormSubmitted = new EventEmitter<FormGroup>();
  onSubmit: boolean = true;
  userList: any = [];
  skillList: any = [];
  selectedSkillIds: any = [];
  skilId: any;
  isModalOpen = false;

  constructor(
    private clientService: ClientService,
    private toastService: ToastService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.clientForm = new FormGroup({
      name: new FormControl('', Validators.required),
      contact_person_name: new FormControl('', Validators.required),
      contact_person_email_id: new FormControl('', Validators.required),
      contact_person_phone: new FormControl('', Validators.required),
      ownership_name: new FormControl(''),
      sales_person_name: new FormControl(''),
      sales_person_email_id: new FormControl(''),
      sales_person_phone: new FormControl(''),
      finance_person_name: new FormControl(''),
      finance_person_email_id: new FormControl(''),
      finance_person_phone: new FormControl(''),
      strength: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      skill_ids: new FormControl(''),
    });

    this.getUserList();
    this.getSkillList();
  }
  isClientFormValid() {
    if (this.clientForm.status == Status.INVALID) {
      this.onSubmit = false;
      return;
    }
    if (this.selectedSkillIds.length == 0) {
      this.toastService.presentToast('Enter atleast one skill');
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
      return i.skill_id == this.clientForm.value.skill_ids;
    });
    if (this.skilId) {
      this.selectedSkillIds.push(this.skilId);
      this.clientForm.value.skill_ids = '';
    }
  }
  primaryskill(event: any) {
    this.skilId['primary_skill'] = event.detail.checked;
    this.skilId = '';
  }
  setClose() {
    this.modalController.dismiss();
  }
}
