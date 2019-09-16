import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
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
      map(
        res => {
          return res;
        }
      ));
  }

  putLocation(obj) {
    obj.UpdateDate = moment().format('YYYY-MM-DD HH:mm:ss');
    obj.UpdateBy = this.credential.Username;
    return this.httpClient.put<any>(this.config.Api.global_api + "/location", obj, { headers: this.headers }).pipe(
      map(
        res => {
          return res;
        }
      ));
  }

  getLocation(crit) {
    return this.httpClient.post<any>(this.config.Api.global_api + "/location/cr", crit, { headers: this.headers }).pipe(
      map(
        res => {
          return res;
        }
      ));
  }
}
