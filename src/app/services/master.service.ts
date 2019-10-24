import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, retry } from 'rxjs/operators';
import * as moment from 'moment';
import * as SecureLS from 'secure-ls';
import { StateService } from './state.service';
import { extend } from 'webdriver-js-extender';
import { AbstractService } from './abstract.service';

@Injectable({
  providedIn: 'root'
})
export class MasterService extends AbstractService {
  config: any;
  credential: any;
  headers: any;
  ls = new SecureLS();
  constructor(private httpClients: HttpClient, private stateServices: StateService) {
    super(httpClients, stateServices);
  }
  postLocation(obj) {
    obj.CreateDate = moment().format('YYYY-MM-DD HH:mm:ss');
    obj.CreateBy = this.credential.Username;
    return this.post("/location",obj);
  }
  putLocation(obj) {
    obj.UpdateDate = moment().format('YYYY-MM-DD HH:mm:ss');
    obj.UpdateBy = this.credential.Username;
    return this.put("/location",obj);
  }
  getLocation(crit) {
    return this.get_post("/location/cr", crit);
  }
  getArea(crit) {
    return this.get_post("/area/cr", crit);
  }
  getEnum(crit) {
    return this.get_post("/enum/cr", crit);
  }
  getTitle(crit) {
    return this.get_post("/organizationlevel/cr", crit);
  }
  getDepartment(crit) {
    return this.get_post("/department/cr", crit);
  }
  getDivision(crit) {
    return this.get_post("/division/cr", crit);
  }
}
