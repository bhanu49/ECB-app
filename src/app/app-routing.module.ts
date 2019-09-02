import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectionComponent } from './selection/selection.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  {
    path: '', component: LoginComponent
  },
  {
    path: 'home', component: SelectionComponent
  },
  {
    path: 'about', component: AboutPageComponent
  }
];
// todo: User auth guards to unauthenticated users from accessing restricted routes
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [SelectionComponent, AboutPageComponent, LoginComponent];
