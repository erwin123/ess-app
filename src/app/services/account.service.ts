import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as SecureLS from 'secure-ls';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  config:any;
  credential: any;
  headers: any;
  ls = new SecureLS();
  constructor(private httpClient: HttpClient, private stateService:StateService) {
    this.config = this.stateService.getConfig();
    this.credential = this.ls.get('currentUser');
    if (this.credential) {
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': this.credential.token
      });
    }
  }

  getJSON(filejson: string): Observable<any> {
    return this.httpClient.get("assets/jsonatte/" + filejson);
  }

  
  login(username, password) {
    let _headers = new HttpHeaders().set('Content-Type', 'application/json');
    // const headers = _headers.append('x-access-token', this.token);
    return this.httpClient.post<any>(this.config.Api.global_api + "/account/login", { Username: username, Password: password }, { headers: _headers }).pipe(
      map(
        res => {
          if(res[0])
          {
            this.ls.set("currentUser", res[0]);
          }
          return res;
        }
      ));
  }
}
