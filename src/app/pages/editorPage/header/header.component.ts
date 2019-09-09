import { Component, OnInit, ViewChild } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { EditorComponent } from '../editor/editor.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild(EditorComponent, { static: false }) editorComponent: EditorComponent;

  faSearch = faSearch;

  constructor() {}

  ngOnInit() {}

  startSearch(value: string) {
    this.editorComponent.searchPdf(value);
  }
}
