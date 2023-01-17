import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'; 
import { catchError, Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Car } from '../dashboard/dashboard.component'; 

@Injectable({
  providedIn: 'root'
}) 
export class CarService {
  
  baseHref:string = "http://localhost:8080";

  constructor(
    private http:HttpClient,
    private _authService:AuthenticationService) {}

  getCars():Observable<Object> { 
    var authParamsStr = this._authService.generateAuthParamsStr();
    return this.http.get(this.baseHref + "/customer/dashboard/load?" + authParamsStr).pipe(
      catchError((error) => {
        throw "ERROR";
      })
    ); 
  }
 
  update(car: Car):Observable<Object> {  
    var obj:any = car;
    var paramsStr = new URLSearchParams(obj).toString();  
    var authParamsStr = this._authService.generateAuthParamsStr();
    return this.http.get(this.baseHref + "/customer/dashboard/update?" + paramsStr + "&" + authParamsStr); 
  }

  delete(car: Car):Observable<Object> {  
    var authParamsStr = this._authService.generateAuthParamsStr();
    return this.http.get(this.baseHref + "/customer/dashboard/delete?id=" + car.id + "&" + authParamsStr);
  }

  add(car: Car) { 
    var obj:any = car;
    var paramsStr = new URLSearchParams(obj).toString();  
    var authParamsStr = this._authService.generateAuthParamsStr();
    return this.http.get(this.baseHref + "/dashboard/add?" + paramsStr + "&" + authParamsStr);
  }
} 