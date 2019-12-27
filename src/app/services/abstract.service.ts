import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, retry, catchError } from 'rxjs/operators';
import * as SecureLS from 'secure-ls';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class AbstractService {
  config: any;
  credential: any;
  headers: any;
  ls = new SecureLS();
  constructor(protected httpClient: HttpClient, protected stateService: StateService) {
    this.config = this.stateService.getConfig();
    this.credential = this.ls.get('currentUser');
    if (this.credential) {
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': this.credential.token,
      });
    }
  }

  getBlob(url) {
    const options: {
      reportProgress: boolean;
      headers: HttpHeaders;
      responseType:'json';
    } = {
      reportProgress: true,
      headers: this.headers,
      responseType:'blob' as 'json'
    };
    return this.httpClient.get<any>(url, options).pipe(
      retry(3), catchError(err => {
        if (err.error.auth == false)
          this.stateService.logout();
        throw err;
      }));
  }


  get(url) {
    return this.httpClient.get<any>(this.config.Api.global_api + url, { headers: this.headers }).pipe(
      retry(3), map(
        res => {
          return res;
        }
      ), catchError(err => {
        if (err.error.auth == false)
          this.stateService.logout();
        throw err;
      }));
  }

  get_post(url, criteria) {
    return this.httpClient.post<any>(this.config.Api.global_api + url, criteria, { headers: this.headers }).pipe(
      retry(3), map(
        res => {
          return res;
        }
      ), catchError(err => {
        if (err.error.auth == false)
          this.stateService.logout();
        throw err;
      }));
  }

  put(url, object) {
    return this.httpClient.put<any>(this.config.Api.global_api + url, object, { headers: this.headers }).pipe(
      retry(3), map(
        res => {
          return res;
        }
      ), catchError(err => {
        if (err.error.auth == false)
          this.stateService.logout();
        throw err;
      }));
  }

  post(url, object) {
    return this.httpClient.post<any>(this.config.Api.global_api + url, object, { headers: this.headers }).pipe(
      retry(3), map(
        res => {
          return res;
        }
      ), catchError(err => {
        if (err.error.auth == false)
          this.stateService.logout();
        throw err;
      }));
  }
}
