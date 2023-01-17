import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminChatComponent } from './admin-chat/admin-chat.component';
import { AdminCustomersComponent } from './admin-customers/admin-customers.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ChatComponent } from './chat/chat.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [ 
  {path:'', redirectTo: 'login', pathMatch: 'full'},
  {path:'chat', component: ChatComponent},
  {path:'dashboard', component: DashboardComponent},
  {path:'login', component: LoginComponent},
  {path:'register', component: RegistrationComponent},
  {path: 'admin/dashboard', component: AdminDashboardComponent},
  {path: 'admin/customers', component: AdminCustomersComponent},
  {path: 'admin/chat', component: AdminChatComponent},
  {path: '**', component: LoginComponent} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {} 
