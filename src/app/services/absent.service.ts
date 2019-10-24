import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map, retry } from 'rxjs/operators';
import * as SecureLS from 'secure-ls';
import { StateService } from './state.service';
import { AbstractService } from './abstract.service';
@Injectable({
  providedIn: 'root'
})
export class AbsentService extends AbstractService {
  config:any;
  credential: any;
  headers: any;
  ls = new SecureLS();
  serviceObj = "/absen"
  constructor(private httpClients: HttpClient, private stateServices:StateService) {
    super(httpClients, stateServices);
  }

  getLastHistory(limit, dateEnd, empId){
    let obj ={
      Limit:limit,
      DateEnd:dateEnd,
      EmployeeID:empId
    };
    return this.post(this.serviceObj+"/history",obj);
  }

  getLast(empId){
    return this.get(this.serviceObj+"/last?empid="+empId);
  }

  postCriteria(criteria) {
    return this.post(this.serviceObj+"/cr",criteria);
  }

  postCriteriaUv(criteria) {
    return this.post(this.serviceObj+"/maintain/cr",criteria);
  }

  postAbsent(obj) {
    return this.post(this.serviceObj,obj);
  }

  putAbsent(obj,empid) {
    return this.put(this.serviceObj+"/"+empid,obj);
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
