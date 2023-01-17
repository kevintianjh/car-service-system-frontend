import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  baseHref = "http://localhost:8080";

  constructor(private http:HttpClient,
              private _authService:AuthenticationService) {}

  fileUpload(file: File) {
    var form_data = new FormData();
    var auth_params = this._authService.generateAuthHeaders();
    form_data.append("uploaded_file", file, file.name);
    form_data.append("header_role", auth_params['header_role']);
    form_data.append("header_username", auth_params['header_username']);
    form_data.append("header_expiry", auth_params['header_expiry']);
    form_data.append("header_signature", auth_params['header_signature']); 
      
    return this.http.post(this.baseHref + "/" + this._authService.getRole() + "/chat/file-upload", form_data).pipe(
      catchError((error) => {throw "ERROR"})
    )
  } 
}
