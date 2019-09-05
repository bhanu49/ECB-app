import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectionComponent } from './selectionPage/selection/selection.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { LoginComponent } from './login/login.component';
import { EditorComponent } from './editorPage/editor/editor.component';

const routes: Routes = [
  /*{
    path: '', component: LoginComponent
  },*/
  {
    path: '',
    component: SelectionComponent
  },
  {
    path: 'about',
    component: AboutPageComponent
  },
  {
    path: 'editor/:id',
    component: EditorComponent
  }
];
// todo: User auth guards to unauthenticated users from accessing restricted routes
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
export const routingComponents = [
  SelectionComponent,
  AboutPageComponent,
  LoginComponent
];
