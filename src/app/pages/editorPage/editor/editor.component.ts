import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GetSelectedFileService } from '../../../restUtils/shared/get-selected-file.service';
import { ActivatedRoute, Params } from '@angular/router';
import { faBookmark, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  faInfo = faInfoCircle;
  name: string;
  opened = false;
  faBookmark = faBookmark;
  status = true;
  title: string;
  date: Date;
  pages: string;
  rowCount: string;
  columnCount: string;
  formType: string;

  constructor(
    private openSelFile: GetSelectedFileService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.name = params.id;
    });
    console.log(this.name);
    const dummyName = 'name';
    // use this.name instead of dummy name
    this.openSelFile.openSelectedFile(dummyName).subscribe(resp => {
      this.title = resp.title;
      this.date = resp.date;
      this.pages = resp.pages;
      this.columnCount = resp.columns;
      this.rowCount = resp.rows;
      this.formType = resp.type;
    });
  }

  toggleSidebar() {
    this.opened = !this.opened;
  }

  markForExport() {
    this.status = !this.status;
  }
}
