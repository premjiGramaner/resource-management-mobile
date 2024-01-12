import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';
import { Modules } from 'src/app/core/enum/static.enum';
import { Partnerskill } from 'src/app/pages/partner/models/partner.model';
import { addSkill, skill } from 'src/app/pages/requirement/models/requirement.model';
import { SearchableDropdownComponent } from '../searchable-dropdown/searchable-dropdown.component';
import { CustomDropDownData, DropdownEvent } from 'src/app/core/base-model/base.model';
import { ToastConstants } from 'src/app/core/constant/toast.message.constant';

@Component({
  selector: 'app-skill-card',
  templateUrl: './skill-card.component.html',
  styleUrls: ['./skill-card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, SearchableDropdownComponent],
})
export class SkillCardComponent implements OnInit {
  @Input() skillList: Partnerskill[] | undefined;
  @Input() flag: string = '';

  addform!: FormGroup;
  @Output() addSkill = new EventEmitter<skill>();
  ratingList = this.staticData.rating;

  skillDropDownData!: CustomDropDownData;
  skillSelectedDropDownData: string = '';
  ratingDropDownData!: CustomDropDownData;
  ratingSelectedDropDownData: string = '';

  constructor(
    private staticData: StaticDataConstants,
    private modalController: ModalController,
    private toastConstants: ToastConstants
  ) { }

  ngOnInit() {
    this.skillDropDownData = {
      title: '',
      data: this.skillList as [],
      config: {
        displayKey: 'description',
        placeholder: this.toastConstants.select_skill,
        searchOnKey: 'description',
        search: true,
      },
    };
    this.ratingDropDownData = {
      title: 'name',
      data: this.ratingList as [],
      config: {
        displayKey: 'name',
        placeholder: this.toastConstants.select_rating,
        searchOnKey: 'name',
        search: true,
      },
    };
    if (this.flag == Modules.Resource) {
      this.addform = new FormGroup({
        skill_id: new FormControl('', Validators.required),
        relevant_experience: new FormControl('', Validators.required),
        rating: new FormControl('', Validators.required),
        primary_skill_ind: new FormControl(false, Validators.required),
      });
    } else if (this.flag.toLowerCase() == Modules.Client.toLowerCase()) {
      this.addform = new FormGroup({
        skill_id: new FormControl('', Validators.required),
      });
    } else if (this.flag.toLowerCase() == Modules.Partner.toLowerCase()) {
      this.addform = new FormGroup({
        skill_id: new FormControl('', Validators.required),
        relevant_experience: new FormControl('', Validators.required),
      });
    } else if (this.flag == Modules.Requirement) {
      this.addform = new FormGroup<addSkill>({
        skill_id: new FormControl('', Validators.required),
        relevant_experience: new FormControl('', Validators.required),
        mandatory_skill: new FormControl(false, Validators.required)
      });
    }
  }

  setClose() {
    this.modalController.dismiss();
  }

  skillSelectedEvent(event: any) {
    event as DropdownEvent;
    this.addform.patchValue({
      skill_id: event.value.skill_id,
    });
  }

  ratingSelectedEvent(event: any) {
    event as DropdownEvent;
    this.addform.patchValue({
      rating: event.value.id,
    });
  }

  specialisedSelectedEvent(event: any) {
    event as DropdownEvent;
    this.addform.patchValue({
      specialised_ind: event.value.id,
    });
  }

  onSubmit(form: FormGroup) {
    if (form.valid) {
      if (this.flag == Modules.Resource) {
        if (form.value.primary_skill_ind) {
          form.value.primary_skill_ind = 1;
        } else {
          form.value.primary_skill_ind = 0;
        }
      } else if (this.flag == Modules.Requirement) {
        if (form.value.mandatory_skill) {
          form.value.mandatory_skill = 1;
        } else {
          form.value.mandatory_skill = 0;
        }
      } else if (this.flag.toLowerCase() == Modules.Partner.toLowerCase()) {
        if (form.value.specialised_ind) {
          form.value.specialised_ind = 1;
        } else {
          form.value.specialised_ind = 0;
        }
      }
      form.value.skill_id = parseInt(form.value.skill_id);
      this.addSkill.emit(form.value);
      this.modalController.dismiss();
    } else {
      this.addform.markAllAsTouched();
    }
  }
}
