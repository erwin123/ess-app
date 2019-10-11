import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import * as moment from 'moment';
import { map, retry } from 'rxjs/operators';
import * as SecureLS from 'secure-ls';
import { StateService } from './state.service';
@Injectable({
  providedIn: 'root'
})
export class AbsentService {
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

  getLastHistory(limit, dateEnd, empId){
    let obj ={
      Limit:limit,
      DateEnd:dateEnd,
      EmployeeID:empId
    };
    return this.httpClient.post<any>(this.config.Api.global_api + "/absen/history",obj, { headers: this.headers }).pipe(
      retry(3),map(
        res => {
          return res;
        }
      ));
  }

  getLast(empId){
    return this.httpClient.get<any>(this.config.Api.global_api + "/absen/last?empid="+empId, { headers: this.headers }).pipe(
      retry(3),map(
        res => {
          return res;
        }
      ));
  }

  postCriteria(criteria) {
    return this.httpClient.post<any>(this.config.Api.global_api + "/absen/maintain/cr", criteria, { headers: this.headers }).pipe(
      retry(3),map(
        res => {
          return res;
        }
      ));
  }

  postAbsent(obj) {
    return this.httpClient.post<any>(this.config.Api.global_api + "/absen", obj, { headers: this.headers }).pipe(
      retry(3),map(
        res => {
          return res;
        }
      ));
  }

  putAbsent(obj) {
    return this.httpClient.put<any>(this.config.Api.global_api + "/absen", obj, { headers: this.headers }).pipe(
      retry(3),map(
        res => {
          return res;
        }
      ));
  }

  postUpload(fileToUpload: File, nameTag: string) {
    let _headers = new HttpHeaders().set('x-access-token', this.credential.token);
    const formData: FormData = new FormData();
    formData.append(nameTag, fileToUpload, fileToUpload.name);
    const options: {
      observe: 'events';
      reportProgress: boolean;
      headers: HttpHeaders;
    } = {
      reportProgress: true,
      observe: 'events',
      headers: _headers
    };
    const req = new HttpRequest('POST', this.config.Api.global_api + "/absen/upload", formData, options);
    return this.httpClient.request(req).pipe(retry(3),map(event => { return event }));
  }
}
