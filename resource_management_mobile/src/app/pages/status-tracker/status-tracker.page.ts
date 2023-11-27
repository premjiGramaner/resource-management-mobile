import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-status-tracker',
  templateUrl: './status-tracker.page.html',
  styleUrls: ['./status-tracker.page.scss'],
})
export class StatusTrackerPage implements OnInit {
  segment: string = "hiring";
  constructor() { }

  ngOnInit() {
  }

  async segmentChanged(event:Event) {
    
  }


}
