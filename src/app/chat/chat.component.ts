import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { ChatService } from '../_services/chat.service';
import { StompService } from '../_services/stomp.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  chat_logs:Array<any> = []; 
  chat_box_text = "";
  admin_username = "";
  admin_typing = false;

  is_dragging = false;
  
  constructor(public router:Router,
              private _stompService:StompService,
              private _authService:AuthenticationService,
              private _snackBar:MatSnackBar,
              private _chatService:ChatService) {}

  dragOver(event:any) {
    event.preventDefault();
    event.stopPropagation(); 
    this.is_dragging = true;
  }

  dragLeave(event:any) {
    event.preventDefault();
    event.stopPropagation(); 
    this.is_dragging = false;
  }

  drop(event:any) { 
    event.preventDefault();
    event.stopPropagation(); 
    this.is_dragging = false; 
    let files = event.dataTransfer.files;
 
    if(this.admin_username == "") {
      this._snackBar.open("Please wait for admin to arrive before sending!", "Close", {duration: 3000});
      return;
    }
    
    if(files.length > 1) { 
      this._snackBar.open("Please select one file only!", "Close", {duration: 3000});
      return;
    }

    let file:File = files[0]; 

    if(file.type == "") {
      this._snackBar.open("Please select a file, not a folder!", "Close", {duration: 3000});
      return;
    }

    this._chatService.fileUpload(file).subscribe(
      (data:any)=>{
        if(data.header_rsp == "ok") {
          this._snackBar.open("Successfully uploaded file!", "Close", {duration: 3000});
          this.sendFile(data.file_name);
        }
        else {
          this._snackBar.open("Failed to upload file, please try again", "Close", {duration: 3000});
        }
      },
      (error)=>{
        this._snackBar.open("Failed to upload file, please try again", "Close", {duration: 3000});
      }
    ) 
  }

  ngOnDestroy() {
    this._stompService.cleanUp();
  }

  ngOnInit() {
    if(this._authService.isCredentialsEmpty() || !this._authService.isCustomerRole()) {
      this.router.navigate(['login', {'expired': '1'}]);
      return;
    } 

    this._stompService.init();
    this._stompService.connect((frame:any) => { 
      this._stompService.subscribe("/chat/admin/send_chat/" + this._authService.getUserName(), (data:any) => {
        this.receiveChat(data);
      })  
    })   
  } 

  typing() { 
    var txt = this.chat_box_text.trim();

    if(txt == "") {
      this._stompService.send("/app/customer/update_typing", {typing: false});
    }
    else {
      this._stompService.send("/app/customer/update_typing", {typing: true});
    }
  }

  updateAdminTypingStatus(data:any) {
    var jsonRsp = JSON.parse(data.body);
    if(jsonRsp.typing) {
      this.admin_typing = true;
    }
    else {
      this.admin_typing = false;
    }
  }

  receiveChat(data:any) {
    var jsonObj = JSON.parse(data.body);

    if(this.admin_username == "") {
      this.admin_username = jsonObj.from;
      this._stompService.subscribe("/chat/admin/update_typing/" + jsonObj.from, (data:any)=>{
        this.updateAdminTypingStatus(data);
      });
    } 
 
    this.chat_logs.push(jsonObj);
  }

  sendFile(fileName:string) {
    var objArg = {
      from: this._authService.getUserName(),
      to: this.admin_username,
      message: "",
      file: fileName
    }

    this.chat_logs.push(objArg);
    this._stompService.send("/app/customer/send_chat", objArg);
  }

  sendChat() {
    this.chat_box_text = this.chat_box_text.trim();

    var objArg = {
      from: this._authService.getUserName(),
      to: this.admin_username,
      message: this.chat_box_text,
      file: ""
    }

    this.chat_logs.push(objArg)
    this.chat_box_text = "";
    this._stompService.send("/app/customer/send_chat", objArg);
    this.typing();
  }
}