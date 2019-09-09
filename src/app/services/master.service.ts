import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../app-config';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  config: any;
  credential: any;

  constructor(private httpClient: HttpClient, private app_config: AppConfig) {
    this.config = this.app_config.get();
    this.credential = JSON.parse(localStorage.getItem('currentUser'));
  }

  postLocation(obj) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': this.credential.token
    });
    obj.CreateDate = moment().format('YYYY-MM-DD HH:mm:ss');
    obj.CreateBy = this.credential.Username;
    return this.httpClient.post<any>(this.config.Api.global_api + "/location", obj, { headers: headers }).pipe(
      map(
        res => {
          return res;
        }
      ));
  }

  getLocation(crit) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': this.credential.token
    });
    return this.httpClient.post<any>(this.config.Api.global_api + "/location/cr", crit, { headers: headers }).pipe(
      map(
        res => {
          return res;
        }
      ));
  }
}
