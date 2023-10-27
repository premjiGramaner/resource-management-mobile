import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-hiring',
  templateUrl: './view-hiring.component.html',
  styleUrls: ['./view-hiring.component.scss'],
})
export class ViewHiringComponent  implements OnInit {
  @Input() viewData: any;

  constructor() { }

  ngOnInit() {}

}
