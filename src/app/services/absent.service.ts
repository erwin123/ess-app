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
  config: any;
  credential: any;
  headers: any;
  ls = new SecureLS();
  serviceObj = "/absen"
  constructor(private httpClients: HttpClient, private stateServices: StateService) {
    super(httpClients, stateServices);
  }

  getLastHistory(limit, dateEnd, empId, lembur?) {
    let obj = {
      Limit: limit,
      DateEnd: dateEnd,
      EmployeeID: empId
    };
    return lembur ? this.post(this.serviceObj + "/lembur/history", obj) : this.post(this.serviceObj + "/history", obj);
  }

  getLast(empId, lembur?) {
    return lembur ? this.get(this.serviceObj + "/lembur/last?empid=" + empId) : this.get(this.serviceObj + "/last?empid=" + empId);
  }

  postCriteria(criteria, lembur?) {
    return lembur ? this.post(this.serviceObj + "/lembur/cr", criteria) : this.post(this.serviceObj + "/cr", criteria);
  }

  postCriteriaUv(criteria, lembur?) {
    return lembur ? this.post(this.serviceObj + "/lembur/maintain/cr", criteria) : this.post(this.serviceObj + "/maintain/cr", criteria);
  }

  postAbsent(obj, lembur?) {
    return lembur ? this.post(this.serviceObj + "/lembur", obj) : this.post(this.serviceObj, obj);
  }

  putAbsent(obj, empid, lembur?) {
    return lembur ? this.put(this.serviceObj + "/lembur/" + empid, obj) : this.put(this.serviceObj + "/" + empid, obj);
  }

  postUpload(fileToUpload: File, nameTag) {
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
    return this.httpClient.request(req).pipe(retry(3), map(event => { return event }));
  }
}
