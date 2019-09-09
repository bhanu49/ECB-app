import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule } from '@angular/forms';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './pages/selectionPage/footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { RemoveComponent } from './pages/selectionPage/remove/remove.component';
import { EditorComponent } from './pages/editorPage/editor/editor.component';
import { HeaderComponent } from './pages/editorPage/header/header.component';
import { EditorFooterComponent } from './pages/editorPage/editor-footer/editor-footer.component';
import {SidebarModule} from 'ng-sidebar';
import {SidebarComponent} from './pages/editorPage/sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    NavbarComponent,
    FooterComponent,
    RemoveComponent,
    EditorComponent,
    HeaderComponent,
    EditorFooterComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FontAwesomeModule,
    NgbModule,
    HttpClientModule,
    SidebarModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
