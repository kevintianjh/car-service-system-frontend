import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs'; 
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AdminCarService {

  baseHref:string = "http://localhost:8080";

  constructor(private http:HttpClient,
              private _authService:AuthenticationService) {}
  
  load(page:any, svcStsFilter="", usernameFilter="") { 
    var params = {page: page, service_status: svcStsFilter, username: usernameFilter};
    var all_params = Object.assign(params, this._authService.generateAuthHeaders());
     
    return this.http.get( 
      this.baseHref + "/admin/dashboard/load",  
      {params: all_params})
      .pipe(
        catchError((error)=> {throw "ERROR"})
      ); 
  }

  update(idList:any, svcStatusList:any) {   
    var params = {id: idList, serviceStatus: svcStatusList}; 
    var all_params = Object.assign(params, this._authService.generateAuthHeaders())

    return this.http.get(
      this.baseHref + "/admin/dashboard/update",
      {params: all_params})
      .pipe(
        catchError((error)=> {throw "ERROR"})
      );  
  }
}