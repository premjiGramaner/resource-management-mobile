import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DuplicateRemoverPipe } from 'src/app/shared/helpers/pipes/duplicate-remover.pipe';
import { ClientArrayData } from '../models/client.model';
import { ClientService } from '../service/client.service';
@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, DuplicateRemoverPipe],
})
export class ViewClientComponent implements OnInit {
  @Input() viewClientData!: ClientArrayData;
  constructor(private clientService: ClientService) { }

  ngOnInit() {
    if (this.viewClientData.skill_ids !== undefined) {
      this.clientService.getSkill().subscribe((res: any) => {
        this.viewClientData.skills = this.viewClientData.skills || [];
        this.viewClientData.skill_ids.map(id => {
          if (id != null) {
            const retrievedData = res.data.skillInfo.find((item: any) => item.skill_id == id);
            if (retrievedData) {
              this.viewClientData.skills.push(retrievedData);
            }
          }
        })
      })
    }
  }
}
