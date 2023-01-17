import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  baseHref = "http://localhost:8080";

  constructor(private http:HttpClient,
              private _authService:AuthenticationService) {} 

  load(page:any, pageSize:any, username:any, email:any) {
    var params:any = {page: page, page_size:pageSize, username:username, email:email};  
    var all_params = Object.assign(params, this._authService.generateAuthHeaders());
     
    return this.http.get(this.baseHref + "/admin/customers/load",
    {params: all_params})
    .pipe(
      catchError((error) => {throw "ERROR"})
    );
  }

  update(username:any, name:any, email:any) {
    var params:any = {username:username, name:name, email:email}; 
    var all_params = Object.assign(params, this._authService.generateAuthHeaders()); 

    return this.http.get(this.baseHref + "/admin/customers/update",
    {params: all_params})
    .pipe(
      catchError((error) => {throw "ERROR"})
    );
  }
}