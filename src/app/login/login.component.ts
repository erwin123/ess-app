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
    username: new FormControl('81190181', [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(10)
    ]),
    password: new FormControl('Sunter123', Validators.required)
  });
  constructor(private accountService: AccountService) { }

  ngOnInit() {
  }

  login() {
    if (this.loginForm.valid) {
      //localStorage.setItem("currentUser","tet");
      this.accountService.login(this.username.value, this.password.value).subscribe(res => {
        localStorage.setItem("currentUser",JSON.stringify(res[0]));
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
