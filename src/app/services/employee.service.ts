import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { map, retry } from "rxjs/operators";
import * as SecureLS from "secure-ls";
import { StateService } from "./state.service";
import * as moment from "moment";
import { AbstractService } from "./abstract.service";

@Injectable({
  providedIn: "root"
})
export class EmployeeService extends AbstractService {
  config: any;
  credential: any;
  headers: any;
  serviceObjEmployee = "/employee";
  serviceObjMessage = "/message";
  ls = new SecureLS();
  constructor(
    private httpClients: HttpClient,
    private stateServices: StateService
  ) {
    super(httpClients, stateServices);
  }

  getEmployee(crit) {
    return this.get_post(this.serviceObjEmployee + "/cr", crit);
  }
  getEmployeeQuickProfile(crit, page) {
    let appended = this.serviceObjEmployee + "/quickprofile";
    appended = page
      ? appended + "/" + page.page + "/" + page.pagesize
      : appended;
    return this.get_post(appended, crit);
  }
  getEmployeeQuickProfileSimple(crit) {
    let appended = this.serviceObjEmployee + "/quickprofile-simple";
    return this.get_post(appended, crit);
  }

  postUpload(fileToUpload: File, nameTag: string, nrp: string) {
    let _headers = new HttpHeaders().set(
      "x-access-token",
      this.credential.token
    );
    const formData: FormData = new FormData();
    formData.append(nameTag, fileToUpload, fileToUpload.name);
    const options: {
      observe: "events";
      reportProgress: boolean;
      headers: HttpHeaders;
    } = {
      reportProgress: true,
      observe: "events",
      headers: _headers
    };
    const req = new HttpRequest(
      "POST",
      this.config.Api.global_api + this.serviceObjEmployee + "/upload/" + nrp,
      formData,
      options
    );
    return this.httpClient.request(req).pipe(
      retry(3),
      map(event => {
        return event;
      })
    );
  }

  postEmployeeTemp(obj) {
    let objAddOn = this.addAuditProp(obj, true);
    return this.post(this.serviceObjEmployee + "/temp", objAddOn);
  }

  putEmployee(obj) {
    let objAddOn = this.addAuditProp(obj, false);
    return this.put(this.serviceObjEmployee, objAddOn);
  }

  postEmployeeAccount(obj) {
    let objAddOn = this.addAuditProp(obj, true);
    return this.post("/account/register", objAddOn);
  }

  //attachment
  postEmployeeAttach(obj) {
    let objAddOn = this.addAuditProp(obj, true);
    return this.post(this.serviceObjEmployee + "/attach", objAddOn);
  }
  postEmployeeAttachTemp(obj) {
    let objAddOn = this.addAuditProp(obj, true);
    return this.post(this.serviceObjEmployee + "/attachtemp", objAddOn);
  }
  putEmployeeAttach(obj) {
    let objAddOn = this.addAuditProp(obj, false);
    return this.put(this.serviceObjEmployee + "/attach", objAddOn);
  }
  putEmployeeAttachTemp(obj) {
    let objAddOn = this.addAuditProp(obj, false);
    // console.log(objAddOn);
    return this.put(this.serviceObjEmployee + "/attachtemp", objAddOn);
  }

  //edu
  postEmployeeEdu(obj) {
    let objAddOn = this.addAuditProp(obj, true);
    return this.post(this.serviceObjEmployee + "/edu", objAddOn);
  }
  postEmployeeEduTemp(obj) {
    let objAddOn = this.addAuditProp(obj, true);
    return this.post(this.serviceObjEmployee + "/edutemp", objAddOn);
  }
  putEmployeeEdu(obj) {
    let objAddOn = this.addAuditProp(obj, false);
    return this.put(this.serviceObjEmployee + "/edu", objAddOn);
  }
  putEmployeeEduTemp(obj) {
    let objAddOn = this.addAuditProp(obj, false);
    return this.put(this.serviceObjEmployee + "/edutemp", objAddOn);
  }
  approveEmployee(type, nrp) {
    return this.post(
      this.serviceObjEmployee + "/approvechange/" + type + "/" + nrp,
      {}
    );
  }

  rejectEmployee(type, nrp) {
    return this.post(
      this.serviceObjEmployee + "/rejectchange/" + type + "/" + nrp,
      {}
    );
  }

  //trn
  postEmployeeTrn(obj) {
    let objAddOn = this.addAuditProp(obj, true);
    return this.post(this.serviceObjEmployee + "/trn", objAddOn);
  }
  postEmployeeTrnTemp(obj) {
    let objAddOn = this.addAuditProp(obj, true);
    return this.post(this.serviceObjEmployee + "/trntemp", objAddOn);
  }
  putEmployeeTrn(obj) {
    let objAddOn = this.addAuditProp(obj, false);
    return this.put(this.serviceObjEmployee + "/trn", objAddOn);
  }
  putEmployeeTrnTemp(obj) {
    let objAddOn = this.addAuditProp(obj, false);
    return this.put(this.serviceObjEmployee + "/trntemp", objAddOn);
  }

  //fam
  postEmployeeFam(obj) {
    let objAddOn = this.addAuditProp(obj, true);
    return this.post(this.serviceObjEmployee + "/fam", objAddOn);
  }
  postEmployeeFamTemp(obj) {
    let objAddOn = this.addAuditProp(obj, true);
    return this.post(this.serviceObjEmployee + "/famtemp", objAddOn);
  }
  putEmployeeFam(obj) {
    let objAddOn = this.addAuditProp(obj, false);
    return this.put(this.serviceObjEmployee + "/fam", objAddOn);
  }

  putEmployeeFamTemp(obj) {
    let objAddOn = this.addAuditProp(obj, false);
    return this.put(this.serviceObjEmployee + "/famtemp", objAddOn);
  }
  deleteFileProfile(nrp, filename) {
    return this.post(this.serviceObjEmployee + "/deletefile/" + nrp, {
      filename: filename
    });
  }

  addAuditProp(obj, isInsert) {
    if (isInsert) {
      obj.CreateDate = moment().format("YYYY-MM-DD HH:mm:ss");
      obj.CreateBy = this.credential.Username;
    } else {
      obj.UpdateDate = moment().format("YYYY-MM-DD HH:mm:ss");
      obj.UpdateBy = this.credential.Username;
    }
    return obj;
  }

  getMessage(crit) {
    return this.get_post(this.serviceObjMessage + "/cr", crit);
  }
  putMessage(obj) {
    return this.put(this.serviceObjMessage, obj);
  }

  downloadFile(targetUrl) {
    return this.getBlob(targetUrl);
  }

  getCountMessageUnread() {
    return this.get(
      this.serviceObjMessage +
        "/countMessageUnread/" +
        this.credential.quickProfile.EmployeeID
    );
  }

  sapEmpProfile(crit) {
    return this.get_post(this.serviceObjEmployee + "/sapEmpProfile", crit);
  }

  sapEmpFam(crit) {
    return this.get_post(this.serviceObjEmployee + "/sapEmpFam", crit);
  }

  sapEmpEdu(crit) {
    return this.get_post(this.serviceObjEmployee + "/sapEmpEdu", crit);
  }

  sapEmpTrn(crit) {
    return this.get_post(this.serviceObjEmployee + "/sapEmpTrn", crit);
  }
}
