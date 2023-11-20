import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/auth/models/auth.model';
import { CookiesConstants } from 'src/app/core/constant/cookies.constants';
import { SecurityService } from 'src/app/shared/helpers/security.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  protected user!: User;
  constructor(private security: SecurityService,
    private cookiesConstants: CookiesConstants) { }

  ngOnInit() {
    try {
      this.user = this.security.getItem(this.cookiesConstants.user);
    } catch (error) {
    }
  }

}
