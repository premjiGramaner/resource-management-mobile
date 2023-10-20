import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';

@Component({
  selector: 'app-skill-card',
  templateUrl: './skill-card.component.html',
  styleUrls: ['./skill-card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class SkillCardComponent  implements OnInit {
  @Input() skillList: any;
  addform!: FormGroup;
  @Output() addSkill = new EventEmitter();
  ratingList = this.staticData.rating;
  constructor(private staticData: StaticDataConstants,     private modalController: ModalController
    ) { }

  ngOnInit() {
    this.addform = new FormGroup({
      skill_id: new FormControl('', Validators.required),
      relevant_experience: new FormControl('', Validators.required),
      rating: new FormControl('', Validators.required),
      primary_skill_ind: new FormControl(false, Validators.required)
    });
  }

  setClose() {
    this.modalController.dismiss();
  }

  onSubmit(form:FormGroup){
    if(form.valid){
      if(form.value.primary_skill_ind){
        form.value.primary_skill_ind = 1;
      } else {
        form.value.primary_skill_ind = 0;
      }
      this.addSkill.emit(form.value);
      this.modalController.dismiss();
    }
  }
}
