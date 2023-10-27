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

@Component({
  selector: 'app-skill-card',
  templateUrl: './skill-card.component.html',
  styleUrls: ['./skill-card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class SkillCardComponent implements OnInit {
  @Input() skillList: any;
  @Input() flag: string = '';

  addform!: FormGroup;
  @Output() addSkill = new EventEmitter();
  ratingList = this.staticData.rating;
  constructor(
    private staticData: StaticDataConstants,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    if (this.flag=="resource") {
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
    } else if (this.flag == 'requirement') {
      this.addform = new FormGroup({
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
      if(this.flag=='resource'){
        if(form.value.primary_skill_ind){
          form.value.primary_skill_ind = 1;
        } else {
          form.value.primary_skill_ind = 0;
        }
      } else if(this.flag=='requirement'){
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
