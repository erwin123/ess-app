import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppConfig } from '../app-config';
@Injectable({
  providedIn: 'root'
})
export class StateService {
  private blocking = new BehaviorSubject<number>(0);
  currentBlocking = this.blocking.asObservable();
  config: any;
  constructor(private app_config: AppConfig) {
    this.config = this.app_config.get();
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
  getDistance(lon1, lat1, lon2, lat2) {
    let earth_radius = 6371;
    let dLat = this.deg2rad(lat2 - lat1);
    let dLon = this.deg2rad(lon2 - lon1);

    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.asin(Math.sqrt(a));
    let d = earth_radius * c;
    return d * 1000;
  }
}
