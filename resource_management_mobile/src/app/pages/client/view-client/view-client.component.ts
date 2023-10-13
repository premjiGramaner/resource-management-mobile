import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ViewClientComponent implements OnInit {
  @Input() viewClientData: any;
  constructor() { }

  ngOnInit() { }
}
