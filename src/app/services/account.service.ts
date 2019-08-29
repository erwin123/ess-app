import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../app-config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  config: any;
  token: any;
  constructor(private httpClient: HttpClient, private app_config: AppConfig) {
    this.config = this.app_config.get();
    //this.token = JSON.parse(localStorage.getItem('currentUser'));
  }

  getJSON(filejson: string): Observable<any> {
    return this.httpClient.get("assets/jsonatte/" + filejson);
  }

  getConfig() {
    return this.app_config.get();
  }

  login(username,password) {
    let _headers = new HttpHeaders().set('Content-Type', 'application/json');
    // const headers = _headers.append('x-access-token', this.token);
    return this.httpClient.post<any>(this.config.Api.global_api + "/account/login", {Username:username, Password:password},{ headers: _headers }).pipe(
      map(
        res => {
          return res;
        }
      ));
  }
}
