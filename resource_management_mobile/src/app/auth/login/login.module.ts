import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';

import { HttpClientModule } from '@angular/common/http';
import { LoginService } from '../login.service';
import { RouteConstants } from 'src/app/core/constant/routes.constants';
import { CookiesConstants } from 'src/app/core/constant/cookies.constants';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [LoginPage],
  providers: [LoginService, RouteConstants, CookiesConstants],
})
export class LoginPageModule {}
