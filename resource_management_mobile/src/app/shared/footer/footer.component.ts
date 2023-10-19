import { Component, OnInit } from '@angular/core';
import { RouteConstants } from 'src/app/core/constant/routes.constants';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor(protected routeConstants: RouteConstants) { }

  ngOnInit() { }
}
