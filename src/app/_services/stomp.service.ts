import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client'
import * as StompJS from 'stompjs'
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root' 
})
export class StompService { 

  private baseHref = "http://localhost:8080/websocket";
  private socket!:any;
  private stompClient!:any; 

  constructor(private _authService:AuthenticationService) {} 

  init() {  
    var authParamsStr = this._authService.generateAuthParamsStr();  
    this.socket = new SockJS(this.baseHref + '?' + authParamsStr); 
    this.stompClient = StompJS.over(this.socket);
  }

  connect(func:any) {
    this.stompClient.connect({}, func);
  }

  subscribe(topic:string, func:any) { 
    return this.stompClient.subscribe(topic, func);
  } 

  send(desination:string, obj:object) {
    this.stompClient.send(desination, {}, JSON.stringify(obj))  
  }    

  cleanUp() { 
    if(this.stompClient !== undefined) {
      this.stompClient.disconnect();
    }

    if(this.socket !== undefined) {
      this.socket.close(); 
    } 
    
    this.socket = null;
    this.stompClient = null;
  }
} 