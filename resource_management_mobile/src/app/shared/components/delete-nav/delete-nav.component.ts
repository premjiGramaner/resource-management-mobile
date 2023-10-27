import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-delete-nav',
  templateUrl: './delete-nav.component.html',
  styleUrls: ['./delete-nav.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class DeleteNavComponent implements OnInit {
  @Input() mySubject: any;
  title: string = '';
  primarybutton: string = '';
  describe: string = '';
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    const preselect = this.mySubject.value;
    this.title = preselect.type + " "+preselect.from;
    this.describe = "Do you want to " + preselect.type.toLowerCase() + " " + preselect.value.toLowerCase() + " ?";
    this.primarybutton = preselect.type;
  }

  primaryAction() {
    this.mySubject.next(true);
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
