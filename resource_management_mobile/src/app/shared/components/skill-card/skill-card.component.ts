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

@Component({
  selector: 'app-skill-card',
  templateUrl: './skill-card.component.html',
  styleUrls: ['./skill-card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class SkillCardComponent implements OnInit {
  @Input() skillList: Partnerskill[] | undefined;
  @Input() flag: string = '';

  addform!: FormGroup;
  @Output() addSkill = new EventEmitter<skill>();
  ratingList = this.staticData.rating;
  constructor(
    private staticData: StaticDataConstants,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    if (this.flag==Modules.Resource) {
      this.addform = new FormGroup({
        skill_id: new FormControl('', Validators.required),
        relevant_experience: new FormControl('', Validators.required),
        rating: new FormControl('', Validators.required),
        primary_skill_ind: new FormControl(false, Validators.required),
      });
    } else if (this.flag == 'client') {
      this.addform = new FormGroup({
        skill_id: new FormControl('', Validators.required),
      });
    } else if (this.flag == 'partner') {
      this.addform = new FormGroup({
        skill_id: new FormControl('', Validators.required),
        relevant_experience: new FormControl('', Validators.required),
      });
    } else if (this.flag == Modules.Requirement) {
      this.addform = new FormGroup<addSkill>({
        skill_id: new FormControl('',Validators.required),
        relevant_experience: new FormControl('',Validators.required),
        mandatory_skill: new FormControl(false,Validators.required)
      });
    } 
  }

  setClose() {
    this.modalController.dismiss();
  }

  onSubmit(form:FormGroup){
    if(form.valid){
      if(this.flag==Modules.Resource){
        if(form.value.primary_skill_ind){
          form.value.primary_skill_ind = 1;
        } else {
          form.value.primary_skill_ind = 0;
        }
      } else if(this.flag==Modules.Requirement){
        if(form.value.mandatory_skill){
          form.value.mandatory_skill = 1;
        } else {
          form.value.mandatory_skill = 0;
        }
      } else if(this.flag=='partner'){
        if(form.value.specialised_ind){
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
