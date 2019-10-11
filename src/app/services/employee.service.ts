import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map,retry } from 'rxjs/operators';
import * as SecureLS from 'secure-ls';
import { StateService } from './state.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  config: any;
  credential: any;
  headers: any;
  serviceObj="/employee";
  ls = new SecureLS();
  constructor(private httpClient: HttpClient, private stateService: StateService) {
    this.config = this.stateService.getConfig();
    this.credential = this.ls.get('currentUser');
    if (this.credential) {
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': this.credential.token
      });
    }
  }

  getEmployee(crit) {
    return this.httpClient.post<any>(this.config.Api.global_api + this.serviceObj+"/cr", crit, { headers: this.headers }).pipe(
      retry(3),map(
        res => {
          return res;
        }
      ));
  }
  getEmployeeQuickProfile(crit, page) {
    let appended = this.serviceObj+"/quickprofile";
    appended = page? appended+"/"+page.page+"/"+page.pagesize:appended;
    return this.httpClient.post<any>(this.config.Api.global_api + appended, crit, { headers: this.headers }).pipe(
      retry(3),map(
        res => {
          return res;
        }
      ));
  }
  getEmployeeQuickProfileSimple(crit) {
    let appended = this.serviceObj+"/quickprofile-simple";
    return this.httpClient.post<any>(this.config.Api.global_api + appended, crit, { headers: this.headers }).pipe(
      retry(3),map(
        res => {
          return res;
        }
      ));
  }
  postUpload(fileToUpload: File, nameTag: string, nrp: string) {
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
    const req = new HttpRequest('POST', this.config.Api.global_api + this.serviceObj+"/upload/" + nrp, formData, options);
    return this.httpClient.request(req).pipe(retry(3),map(event => { return event }));
  }

  putEmployee(obj) {
    let objAddOn = this.addAuditProp(obj, false);
    return this.httpClient.put<any>(this.config.Api.global_api + this.serviceObj ,objAddOn, { headers: this.headers }).pipe(
      retry(3),map(
        res => {
          return res;
        }
      ));
  }

  postEmployeeAccount(obj) {
    let objAddOn = this.addAuditProp(obj, true);
    return this.httpClient.post<any>(this.config.Api.global_api + "/account/register",objAddOn, { headers: this.headers }).pipe(
      retry(3),map(
        res => {
          return res;
        }
      ));
  }

  //edu
  postEmployeeEdu(obj) {
    let objAddOn = this.addAuditProp(obj, true);
    return this.httpClient.post<any>(this.config.Api.global_api + this.serviceObj+"/edu",objAddOn, { headers: this.headers }).pipe(
      retry(3),map(
        res => {
          return res;
        }
      ));
  }

  postEmployeeEduTemp(obj) {
    let objAddOn = this.addAuditProp(obj, true);
    return this.httpClient.post<any>(this.config.Api.global_api + this.serviceObj+"/edutemp",objAddOn, { headers: this.headers }).pipe(
      retry(3),map(
        res => {
          return res;
        }
      ));
  }

  //trn
  postEmployeeTrn(obj) {
    let objAddOn = this.addAuditProp(obj, true);
    return this.httpClient.post<any>(this.config.Api.global_api + this.serviceObj+"/trn",objAddOn, { headers: this.headers }).pipe(
      retry(3),map(
        res => {
          return res;
        }
      ));
  }

  postEmployeeTrnTemp(obj) {
    let objAddOn = this.addAuditProp(obj, true);
    return this.httpClient.post<any>(this.config.Api.global_api + this.serviceObj+"/trntemp",objAddOn, { headers: this.headers }).pipe(
      retry(3),map(
        res => {
          return res;
        }
      ));
  }

  //trn
  postEmployeeFam(obj) {
    let objAddOn = this.addAuditProp(obj, true);
    return this.httpClient.post<any>(this.config.Api.global_api + this.serviceObj+"/fam",objAddOn, { headers: this.headers }).pipe(
      retry(3),map(
        res => {
          return res;
        }
      ));
  }

  postEmployeeFamTemp(obj) {
    let objAddOn = this.addAuditProp(obj, true);
    return this.httpClient.post<any>(this.config.Api.global_api + this.serviceObj+"/famtemp",objAddOn, { headers: this.headers }).pipe(
      retry(3),map(
        res => {
          return res;
        }
      ));
  }

  deleteFileProfile(nrp, filename) {
    return this.httpClient.post<any>(this.config.Api.global_api + this.serviceObj+"/deletefile/" + nrp, { filename: filename }, { headers: this.headers }).pipe(
      retry(3),map(
        res => {
          return res;
        }
      ));
  }

  addAuditProp(obj, isInsert){
    if(isInsert){
      obj.CreateDate = moment().format("YYYY-MM-DD HH:mm:ss");
      obj.CreateBy = this.credential.Username;
    }else{
      obj.UpdateDate = moment().format("YYYY-MM-DD HH:mm:ss");
      obj.UpdateBy = this.credential.Username;
    }
    return obj;
  }
}
