import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginResponse } from '../models/auth.model';
import { Router } from '@angular/router';
import { Status } from '../../core/enum/status.enum';
import { SecurityService } from 'src/app/shared/helpers/security.service';
import { RouteConstants } from 'src/app/core/constant/routes.constants';
import { CookiesConstants } from 'src/app/core/constant/cookies.constants';
import { ToastService } from 'src/app/core/toast/toast.service';
import { ToastConstants } from 'src/app/core/constant/toast.message.constant';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  showPasswordText: boolean = false;
  passwordInputType: string = 'password';
  onSubmit: boolean = true;

  constructor(
    private loginService: LoginService,
    private fb: FormBuilder,
    private router: Router,
    private security: SecurityService,
    private routeConstants: RouteConstants,
    private cookiesConstants: CookiesConstants,
    private toastService: ToastService,
    private toastConstants: ToastConstants
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  passwordShow() {
    this.showPasswordText = !this.showPasswordText;
    this.passwordInputType =
      this.showPasswordText == true ? 'text' : 'password';
  }

  submit() {
    if (this.loginForm.status == Status.INVALID) {
      this.onSubmit = false;
    }
    if (this.loginForm.valid) {
      this.loginService.postLoginRequest(this.loginForm.value).subscribe({
        next: (res: LoginResponse) => {
          if (res.statusCode == 200) {
            this.security.setItem(this.cookiesConstants.token, res.data.jwt);
            this.security.setItem(
              this.cookiesConstants.user,
              res.data.userData
            );
            this.router.navigate([this.routeConstants.dashboard]);
          }
        },
        error: (error) => {
          this.toastService.errorToast(this.toastConstants.invalidUser);
        }
      });
    }
  }
}
