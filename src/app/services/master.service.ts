import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, retry } from 'rxjs/operators';
import * as moment from 'moment';
import * as SecureLS from 'secure-ls';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  config: any;
  credential: any;
  headers:any;
  ls = new SecureLS();
  constructor(private httpClient: HttpClient, private stateService:StateService) {
    this.config = this.stateService.getConfig();
    this.credential = this.ls.get('currentUser');
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': this.credential.token
    });
  }

  postLocation(obj) {
    obj.CreateDate = moment().format('YYYY-MM-DD HH:mm:ss');
    obj.CreateBy = this.credential.Username;
    return this.httpClient.post<any>(this.config.Api.global_api + "/location", obj, { headers: this.headers }).pipe(
      retry(3),map(
        res => {
          return res;
        }
      ));
  }

  putLocation(obj) {
    obj.UpdateDate = moment().format('YYYY-MM-DD HH:mm:ss');
    obj.UpdateBy = this.credential.Username;
    return this.httpClient.put<any>(this.config.Api.global_api + "/location", obj, { headers: this.headers }).pipe(
      retry(3),map(
        res => {
          return res;
        }
      ));
  }

  getLocation(crit) {
    return this.httpClient.post<any>(this.config.Api.global_api + "/location/cr", crit, { headers: this.headers }).pipe(
      retry(3),map(
        res => {
          return res;
        }
      ));
  }

  getArea(crit) {
    return this.httpClient.post<any>(this.config.Api.global_api + "/area/cr", crit, { headers: this.headers }).pipe(
      retry(3),map(
        res => {
          return res;
        }
      ));
  }

  getEnum(crit) {
    return this.httpClient.post<any>(this.config.Api.global_api + "/enum/cr", crit, { headers: this.headers }).pipe(
      retry(3),map(
        res => {
          return res;
        }
      ));
  }
  getTitle(crit) {
    return this.httpClient.post<any>(this.config.Api.global_api + "/organizationlevel/cr", crit, { headers: this.headers }).pipe(
      retry(3),map(
        res => {
          return res;
        }
      ));
  }
  getDepartment(crit) {
    return this.httpClient.post<any>(this.config.Api.global_api + "/department/cr", crit, { headers: this.headers }).pipe(
      retry(3),map(
        res => {
          return res;
        }
      ));
  }
  getDivision(crit) {
    return this.httpClient.post<any>(this.config.Api.global_api + "/division/cr", crit, { headers: this.headers }).pipe(
      retry(3),map(
        res => {
          return res;
        }
      ));
  }
}
