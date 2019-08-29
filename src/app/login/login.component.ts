import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(16)
    ]),
    password: new FormControl('', Validators.required)
  });
  constructor(private accountService: AccountService) { }

  ngOnInit() {
  }

  login() {
    if (this.loginForm.valid) {
      this.accountService.login(this.username.value, this.password.value).subscribe(res => {
        localStorage.setItem("currentUser",res);
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
