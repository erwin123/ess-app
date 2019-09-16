import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as SecureLS from 'secure-ls';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl('81190181', [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(10)
    ]),
    password: new FormControl('Sunter123', Validators.required)
  });
  ls = new SecureLS();
  message = "";
  constructor(private accountService: AccountService, private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {

  }

  login() {
    if (this.loginForm.valid) {
      this.accountService.login(this.username.value, this.password.value).subscribe(res => {
        if (res[0]) {
          this.route.queryParams.subscribe(r => {
            if (r.returnUrl)
              this.router.navigate([r.returnUrl]);
            else
              this.router.navigate(['main/landing']);
          });

        } else {
          this.message = "Username atau password tidak sesuai.";
          setTimeout(() => {
            this.message = "";
          }, 3000);
        }
      })
    }
  }

  get username() {
    return this.loginForm.get('username')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }
}
