import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { GetSelectedFileService } from '../../../restUtils/shared/get-selected-file.service';
import { ActivatedRoute, Params } from '@angular/router';
import { faBookmark, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, AfterViewInit {
  @ViewChild(PdfViewerComponent, { static: false }) private pdfComponent: PdfViewerComponent;

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
  response: any;
  pdfSrc = '/assets/pdfToTables.pdf';
  totalPages: number;
  isLoaded = false;

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
      this.response = resp;
      this.title = this.response.title;
      this.date = this.response.date;
      this.pages = this.response.pages;
      this.columnCount = this.response.columns;
      this.rowCount = this.response.rows;
      this.formType = this.response.type;
    });
  }

  ngAfterViewInit(): void {}

  toggleSidebar() {
    this.opened = !this.opened;
  }

  markForExport() {
    this.status = !this.status;
  }

  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }

  searchPdf(value: string) {
    console.log(value);
    this.pdfComponent.pdfFindController.executeCommand('find', {
      caseSensitive: false, findPrevious: undefined, highlightAll: true, phraseSearch: true, query: value
    });
  }
}
