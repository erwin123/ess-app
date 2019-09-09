import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private blocking = new BehaviorSubject<number>(0);
  currentBlocking = this.blocking.asObservable();
  constructor() { }
  setBlocking(o){
    this.blocking.next(o);
  }
}
