import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppConfig } from '../app-config';
import * as SecureLS from 'secure-ls';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class StateService {
  ls = new SecureLS();
  config: any;
  objCredential: any;
  private blocking = new BehaviorSubject<number>(0);
  currentBlocking = this.blocking.asObservable();

  private credential = new BehaviorSubject<any>(this.ls.get('currentUser'));
  currentCredential = this.credential.asObservable();

  // private profilePic = new BehaviorSubject<any>(this.app_config.get().profile + "person-icon.png");
  private profilePic = new BehaviorSubject<any>("");
  currentProfilePic = this.profilePic.asObservable();

  constructor(private app_config: AppConfig) {
    
    this.config = this.app_config.get();
    if (this.ls.get('currentUser') && this.config) {
      this.objCredential = this.ls.get('currentUser');
      if(!this.objCredential.quickProfile){
        this.logout();
      }
      if (this.objCredential.quickProfile.Photo) {
        this.profilePic.next(this.config.Api.profile + this.objCredential.Username + "/" + this.objCredential.quickProfile.Photo);
      } else {
        this.profilePic.next(this.config.Api.profile + "person-icon.png");
      }
    } else {
      this.profilePic.next(this.config.Api.profile + "person-icon.png");
    }
  }
  getDefaultPhoto() {
    return this.config.Api.profile + "person-icon.png";
  }
  setDefaultProfilePic() {
    this.profilePic.next(this.config.Api.profile + "person-icon.png");
  }
  setProfilePic(o) {
    this.profilePic.next(o);
  }
  setCredential(o) {
    this.credential.next(o);
    this.ls.set('currentUser', o);
  }
  setBlocking(o) {
    this.blocking.next(o);
  }
  public getConfig() {
    return this.app_config.get();
  }
  deg2rad(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
  }
  // getDistance(lon1, lat1, lon2, lat2) {
  //   let earth_radius = 6371;
  //   let dLat = this.deg2rad(lat2 - lat1);
  //   let dLon = this.deg2rad(lon2 - lon1);

  //   let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  //   let c = 2 * Math.asin(Math.sqrt(a));
  //   let d = earth_radius * c;
  //   return d * 1000;
  // }
  getDistanceLonLat(lonlat1, lonlat2) {
    let earth_radius = 6371;
    let dLat = this.deg2rad(lonlat2[1] - lonlat1[1]);
    let dLon = this.deg2rad(lonlat2[0] - lonlat1[0]);

    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.deg2rad(lonlat1[1])) * Math.cos(this.deg2rad(lonlat2[1])) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.asin(Math.sqrt(a));
    let d = earth_radius * c;
    return d * 1000;
  }

  dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  fillValidator(arrayValidator, callback) {
    let collValidator: Validators[] = [];
    arrayValidator.forEach(el => {

      switch (el) {
        case "required":
          collValidator.push(Validators.required);
          break;
        case "number":
          collValidator.push(Validators.pattern('^[0-9]+$'));
          break;
        case "email":
          collValidator.push(Validators.email);
          break;
        default:
          break;
      }
    });
    callback(collValidator);
  }

  toFormGroup(fields) {
    let group: any = {};
    fields.forEach(question => {
      if (question.validator.length)
        this.fillValidator(question.validator, res => {
          if (res.length) {
            group[question.key] = new FormControl(question.value || '', res);
          }
        })
      else
        group[question.key] = new FormControl(question.value || '');
      
      if(question.disable)
      group[question.key].disable();
    });
    return new FormGroup(group);
  }

  resetForm(form: FormGroup, data?: any) {
    if (data) {
      Object.keys(form.controls).forEach(key => {
        form.get(key).setValue(data[key]);
      });
    } else {
      form.reset();
      Object.keys(form.controls).forEach(key => {
        form.get(key).setErrors(null);
      });
    }
  }

  groupFunc(value: Array<any>, field: string): Array<any> {
    const groupedObj = value.reduce((prev, cur) => {
      if (!prev[cur[field]]) {
        prev[cur[field]] = [cur];
      } else {
        prev[cur[field]].push(cur);
      }
      return prev;
    }, {});
    return Object.keys(groupedObj).map(key => ({ key, value: groupedObj[key] }));
  }

  logout() {
    this.blocking = new BehaviorSubject<number>(0);
    this.credential = new BehaviorSubject<any>(this.ls.get('currentUser'));
    this.profilePic = new BehaviorSubject<any>("");
    this.ls.clear();
    setTimeout(() => {
      window.location.reload(true);
    }, 500);
  }
}
