import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, retry } from "rxjs/operators";
import * as moment from "moment";
import * as SecureLS from "secure-ls";
import { StateService } from "./state.service";
import { extend } from "webdriver-js-extender";
import { AbstractService } from "./abstract.service";

@Injectable({
  providedIn: "root"
})
export class MasterService extends AbstractService {
  config: any;
  credential: any;
  headers: any;
  ls = new SecureLS();
  constructor(
    private httpClients: HttpClient,
    private stateServices: StateService
  ) {
    super(httpClients, stateServices);
  }
  postLocation(obj) {
    obj.CreateDate = moment().format("YYYY-MM-DD HH:mm:ss");
    obj.CreateBy = this.credential.Username;
    return this.post("/location", obj);
  }
  postWorkLocation(obj) {
    obj.CreateDate = moment().format("YYYY-MM-DD HH:mm:ss");
    obj.CreateBy = this.credential.Username;
    return this.post("/work-location", obj);
  }
  putLocation(obj) {
    obj.UpdateDate = moment().format("YYYY-MM-DD HH:mm:ss");
    obj.UpdateBy = this.credential.Username;
    return this.put("/location", obj);
  }
  putWorkLocation(obj) {
    obj.UpdateDate = moment().format("YYYY-MM-DD HH:mm:ss");
    obj.UpdateBy = this.credential.Username;
    return this.put("/work-location", obj);
  }
  getWorkLocation(crit) {
    return this.get_post("/work-location/cr", crit);
  }
  getShift() {
    return this.get("/shift");
  }
  getShiftById(Id) {
    return this.get("/shift/" + Id);
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
  postDepartment(obj) {
    obj.CreateDate = moment().format("YYYY-MM-DD HH:mm:ss");
    obj.CreateBy = this.credential.Username;
    return this.post("/department", obj);
  }
  putDepartment(obj) {
    obj.UpdateDate = moment().format("YYYY-MM-DD HH:mm:ss");
    obj.UpdateBy = this.credential.Username;
    return this.put("/department", obj);
  }
  getDepartment(crit) {
    return this.get_post("/department/cr", crit);
  }
  postDivision(obj) {
    obj.CreateDate = moment().format("YYYY-MM-DD HH:mm:ss");
    obj.CreateBy = this.credential.Username;
    return this.post("/division", obj);
  }
  putDivision(obj) {
    obj.UpdateDate = moment().format("YYYY-MM-DD HH:mm:ss");
    obj.UpdateBy = this.credential.Username;
    return this.put("/division", obj);
  }
  getDivision(crit) {
    return this.get_post("/division/cr", crit);
  }
  postHoliday(obj) {
    obj.CreateDate = moment().format("YYYY-MM-DD HH:mm:ss");
    obj.CreateBy = this.credential.Username;
    return this.post("/holiday", obj);
  }
  putHoliday(obj) {
    obj.UpdateDate = moment().format("YYYY-MM-DD HH:mm:ss");
    obj.UpdateBy = this.credential.Username;
    return this.put("/holiday", obj);
  }
  getCalendar() {
    return this.get("/holiday/calendar");
  }
  getHoliday(crit) {
    return this.get_post("/holiday/cr", crit);
  }
  postCuti(obj) {
    obj.CreateDate = moment().format("YYYY-MM-DD HH:mm:ss");
    obj.CreateBy = this.credential.Username;
    return this.post("/cuti", obj);
  }
  putCuti(obj) {
    obj.UpdateDate = moment().format("YYYY-MM-DD HH:mm:ss");
    obj.UpdateBy = this.credential.Username;
    return this.put("/cuti", obj);
  }
  getCuti(crit) {
    return this.get_post("/cuti/cr", crit);
  }
  postClaim(obj) {
    obj.CreateDate = moment().format("YYYY-MM-DD HH:mm:ss");
    obj.CreateBy = this.credential.Username;
    return this.post("/claim", obj);
  }
  putClaim(obj) {
    obj.UpdateDate = moment().format("YYYY-MM-DD HH:mm:ss");
    obj.UpdateBy = this.credential.Username;
    return this.put("/claim", obj);
  }
  getClaim(crit) {
    return this.get_post("/claim/cr", crit);
  }

  postMasterApproval(obj) {
    obj.CreateDate = moment().format("YYYY-MM-DD HH:mm:ss");
    obj.CreateBy = this.credential.Username;
    return this.post("/approval/step", obj);
  }
  putMasterApproval(obj) {
    obj.UpdateDate = moment().format("YYYY-MM-DD HH:mm:ss");
    obj.UpdateBy = this.credential.Username;
    return this.put("/approval/step", obj);
  }
  getMasterApproval(crit) {
    return this.get_post("/approval/step/cr", crit);
  }

  postSpd(obj) {
    obj.CreateDate = moment().format("YYYY-MM-DD HH:mm:ss");
    obj.CreateBy = this.credential.Username;
    return this.post("/spd", obj);
  }
  putSpd(obj) {
    obj.UpdateDate = moment().format("YYYY-MM-DD HH:mm:ss");
    obj.UpdateBy = this.credential.Username;
    return this.put("/spd", obj);
  }
  getSpd(crit) {
    return this.get_post("/spd/cr", crit);
  }

  postDocClaim(obj) {
    obj.CreateDate = moment().format("YYYY-MM-DD HH:mm:ss");
    obj.CreateBy = this.credential.Username;
    return this.post("/claim/doc", obj);
  }
  putDocClaim(obj) {
    obj.UpdateDate = moment().format("YYYY-MM-DD HH:mm:ss");
    obj.UpdateBy = this.credential.Username;
    return this.put("/claim/doc", obj);
  }
  getDocClaim(crit) {
    return this.get_post("/claim/doc/cr", crit);
  }

  postDocCuti(obj) {
    obj.CreateDate = moment().format("YYYY-MM-DD HH:mm:ss");
    obj.CreateBy = this.credential.Username;
    return this.post("/cuti/doc", obj);
  }
  putDocCuti(obj) {
    obj.UpdateDate = moment().format("YYYY-MM-DD HH:mm:ss");
    obj.UpdateBy = this.credential.Username;
    return this.put("/cuti/doc", obj);
  }
  getDocCuti(crit) {
    return this.get_post("/cuti/doc/cr", crit);
  }
  getCutiBalance(obj) {
    return this.get_post("/cutibalance/checkBalance", obj);
  }
  postShift(obj) {
    obj.CreateDate = moment().format("YYYY-MM-DD HH:mm:ss");
    obj.CreateBy = this.credential.Username;
    return this.post("/shift", obj);
  }
  putShift(Id, obj) {
    obj.UpdateDate = moment().format("YYYY-MM-DD HH:mm:ss");
    obj.UpdateBy = this.credential.Username;
    return this.put("/shift/" + Id, obj);
  }
}
