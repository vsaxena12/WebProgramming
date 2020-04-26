import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  credentials=[];
  constructor() { }
  getcredentials(){ return this.credentials; }
}
