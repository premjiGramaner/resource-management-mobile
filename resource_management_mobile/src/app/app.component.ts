import { Component, OnInit } from '@angular/core';
import { CookiesConstants } from './core/constant/cookies.constants';
import { SecurityService } from './shared/helpers/security.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private securityService: SecurityService,
    private cookiesConstants: CookiesConstants
  ) { }
  ngOnInit() {
    const selectedTheme = this.securityService.getItem(
      this.cookiesConstants.themeValue
    );
    if (selectedTheme) {
      document.body.classList.toggle('dark', selectedTheme);
    }
  }
}
