import { Component, OnInit } from '@angular/core';
import { CookiesConstants } from 'src/app/core/constant/cookies.constants';
import { SecurityService } from 'src/app/shared/helpers/security.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  themeToggle = false;
  constructor(
    private securityService: SecurityService,
    private cookiesConstants: CookiesConstants
  ) { }

  ngOnInit() {
    const selectedTheme = this.securityService.getItem(
      this.cookiesConstants.themeValue
    );
    this.themeToggle = selectedTheme;
  }

  toggleChange(ev: any) {
    const themeValue = ev.detail.checked;
    this.toggleDarkTheme(themeValue);
    this.securityService.setItem(this.cookiesConstants.themeValue, themeValue);
  }

  toggleDarkTheme(shouldAdd: boolean) {
    document.body.classList.toggle('dark', shouldAdd);
  }
}
