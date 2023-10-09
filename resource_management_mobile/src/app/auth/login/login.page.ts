import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm !: FormGroup;
  showPasswordText:boolean = false;
  type:string = 'password';
  onSubmit:boolean = true;
  constructor(private loginService:LoginService,private fb: FormBuilder,private router:Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]});
  }
  
  passwordShow(){
    this.showPasswordText =! this.showPasswordText;
    this.type =  (this.showPasswordText == true ? 'text':'password')
  }

  submit(){
    console.log()
   if(this.loginForm.status == 'INVALID'){
    this.onSubmit = false
   }
   this.router.navigate(['main/dashboard'])
    // this.loginService.postLoginRequest(this.loginForm.value).subscribe(((res:LoginResponse)=>{
    //   console.log(res);
    //   this.router.navigate(['/main/dashboard'])
    // }))
  }

}
