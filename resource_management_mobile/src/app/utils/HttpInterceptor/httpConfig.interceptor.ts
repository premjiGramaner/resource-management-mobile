//httpConfig.interceptor.ts
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { CookiesConstants } from 'src/app/core/constant/cookies.constants';
import { SecurityService } from 'src/app/shared/helpers/security.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/core/toast/toast.service';
import { ToastConstants } from 'src/app/core/constant/toast.message.constant';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  loaderToShow: any;
  constructor(
    public loadingController: LoadingController,
    private cookiesConstants: CookiesConstants,
    private toastConstants: ToastConstants,
    private security: SecurityService,
    private router: Router,
    private toastService: ToastService
  ) { }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.security.getItem(this.cookiesConstants.token);

    //Authentication by setting header with token value
    if (token) {
      request = request.clone({
        setHeaders: {
          'token': token
        }
      });
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        setHeaders: {
          'content-type': 'application/json'
        }
      });
    }

    request = request.clone({
      headers: request.headers.set('Accept', 'application/json')
    });
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {

        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.error.error.name == this.toastConstants.tokenError) {
          this.toastService.errorToast(this.toastConstants.timeout);
          this.router.navigate(['']);
          this.security.clearItem();
        }
        return throwError(error);
      }));
  }

  showLoader() {
    this.loaderToShow = this.loadingController.create({
      message: 'Processing Server Request'
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
      });
    });
    this.hideLoader();
  }

  hideLoader() {
    this.loadingController.dismiss();
  }


}
