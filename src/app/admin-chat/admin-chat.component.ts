import { Component } from '@angular/core'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router'; 
import { AuthenticationService } from '../_services/authentication.service';
import { ChatService } from '../_services/chat.service';
import { StompService } from '../_services/stomp.service'; 
 
@Component({
  selector: 'app-admin-chat',
  templateUrl: './admin-chat.component.html',
  styleUrls: ['./admin-chat.component.css']  
})
export class AdminChatComponent {  
  customer_list:Array<string> = []; 
  chat_logs_map:Map<string, any> = new Map();

  changing_username = false;
  selected_chat_logs:Array<any> = [];
  selected_username = "";
  chat_box_text = "";

  typing_subscription_ref:any = undefined;
  customer_typing:boolean = false;

  is_dragging_file = false; 

  dragOver(event:Event) {
    event.preventDefault();
    event.stopPropagation();
    this.is_dragging_file = true; 
  }

  dragLeave(event:Event) {
    event.preventDefault();
    event.stopPropagation();
    this.is_dragging_file = false; 
  }

  drop(event:any) {
    event.preventDefault();
    event.stopPropagation(); 
    this.is_dragging_file = false;

    if(this.selected_username == "") {
      this._snackBar.open("Please start a chat to upload file!", "Close", {duration:3000})
      return;
    }
    
    var files = event.dataTransfer.files;
    var file:File = files[0];
    if(files.length > 1) {
      this._snackBar.open("Please select one file at a time!", "Close", {duration:3000})
      return;
    }

    if(file.type == "") {
      this._snackBar.open("Please do not upload folder!", "Close", {duration:3000})
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

  sendFile(fileName:string) {
    var msg = {
      from: this._authService.getUserName(),
      to: this.selected_username,
      message: "",
      file: fileName
    }

    this.selected_chat_logs.push(msg);
    this._stompService.send("/app/admin/send_chat", msg);
  }
 
  constructor(private _stompService:StompService,
              private _authService:AuthenticationService,
              public router:Router,
              private _snackBar:MatSnackBar,
              private _chatService:ChatService) {}

  ngOnDestroy() {   
    this._stompService.cleanUp();  
  }
    
  ngOnInit() { 
    if(this._authService.isCredentialsEmpty() || !this._authService.isAdminRole()) {
      this.router.navigate(["login", {expired: "1"}]);
      return;
    }   
     
    this._stompService.init();
    this._stompService.connect((frame:any) => {

      this._stompService.subscribe("/chat/admin/get_customer_list", (data:any)=>{
        this.populateCustomerList(data);
      });

      this._stompService.subscribe("/chat/customer/send_chat/" + this._authService.getUserName(), (data:any)=>{
        this.receiveMessage(data);
      })

      this._stompService.send("/app/admin/get_customer_list", {});
    }) 
  }  

  receiveMessage(data: any) {
    var json_rsp = JSON.parse(data.body);
    var chat_logs = this.chat_logs_map.get(json_rsp.from);

    if(chat_logs !== undefined) {
      chat_logs.push(json_rsp);
    }
  }

  populateCustomerList(data:any) {
    this.customer_list = [];
    this.chat_logs_map = new Map();
    this.selected_username = "";
    var jsonObj = JSON.parse(data.body);
    for(let i of jsonObj) {
      this.customer_list.push(i);
      this.chat_logs_map.set(i, []);
    } 

    this.changeUsernameDdl();
  }

  changeUsernameDdl() {
    this.changing_username = true; 

    this.customer_typing = false;
    this.selected_chat_logs = [];
    if(this.typing_subscription_ref !== undefined) {
      this.typing_subscription_ref.unsubscribe();
      this.typing_subscription_ref = undefined;
    }

    if(this.selected_username != "") {
      this.selected_chat_logs = <Array<any>>this.chat_logs_map.get(this.selected_username);  
      this.typing_subscription_ref = this._stompService.subscribe("/chat/customer/update_typing/" + this.selected_username, (data:any)=>{
        this.updateCustomerTypingStatus(data);
      });
    } 
    
    this.changing_username = false;
  }

  updateCustomerTypingStatus(data:any) {
    var jsonRsp = JSON.parse(data.body);
    if(jsonRsp.typing) {
      this.customer_typing = true;
    }
    else {
      this.customer_typing = false;
    }
  }

  sendChat() {
    var objArg = {
      from: this._authService.getUserName(),
      to: this.selected_username,
      message: this.chat_box_text.trim(),
      file: ""
    }
    
    this.selected_chat_logs.push(objArg);
    this._stompService.send("/app/admin/send_chat", objArg);
    this.chat_box_text = "";
    this.typing();
  }

  typing() {
    if(this.chat_box_text.trim() == "") {
      this._stompService.send("/app/admin/update_typing", {typing: false});
    }
    else {
      this._stompService.send("/app/admin/update_typing", {typing: true});
    }
  }
}