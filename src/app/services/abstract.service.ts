import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import * as moment from 'moment';
import { map, retry } from 'rxjs/operators';
import * as SecureLS from 'secure-ls';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class AbstractService {
  config:any;
  credential: any;
  headers: any;
  ls = new SecureLS();
  constructor(protected httpClient: HttpClient, protected stateService:StateService) {
    this.config = this.stateService.getConfig();
    this.credential = this.ls.get('currentUser');
    if (this.credential) {
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': this.credential.token
      });
    }
  }
}
