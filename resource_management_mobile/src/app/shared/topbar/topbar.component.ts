import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteConstants } from 'src/app/core/constant/routes.constants';
import { SecurityService } from '../helpers/security.service';
import { CookiesConstants } from 'src/app/core/constant/cookies.constants';
import { User } from 'src/app/auth/models/auth.model';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  protected user!: User;
  constructor(
    protected routeConstants: RouteConstants,
    private router: Router,
    private security: SecurityService,
    private cookiesConstants: CookiesConstants
  ) { }

  ngOnInit() {
    try {
      this.user = this.security.getItem(this.cookiesConstants.user);
    } catch (error) {
    }
  }

  logout() {
    this.router.navigate(['']);
    this.security.clearItem();
  }
}
