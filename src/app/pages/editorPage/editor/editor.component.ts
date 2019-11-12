import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';

import { GetSelectedFileService } from '../../../restUtils/shared/get-selected-file.service';
import { ActivatedRoute, Params } from '@angular/router';
import { faBookmark, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { catchError, map } from 'rxjs/operators';
import { forkJoin, throwError } from 'rxjs';
declare let $;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent
  implements OnInit, AfterViewInit, AfterViewChecked {
  constructor(
    private openSelFile: GetSelectedFileService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  @ViewChild(PdfViewerComponent, { static: false })
  private pdfComponent: PdfViewerComponent;

  @ViewChild('pdfViewer', { static: false }) pdfViewer: ElementRef;

  faInfo = faInfoCircle;
  name: string;
  fixHeader = true;
  opened = [];
  tableInd: number;
  faBookmark = faBookmark;
  status = [];
  date: Date;
  tableData: any;
  totalPages: number;
  isLoaded = false;
  selectedTbl: any = { table_id: '', Is_first_line_of_table: '' };
  markedTables = [];
  allTables = [];
  pdfData;
  tableCount = 0;

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.name = params.id;
    });

    this.initializeComponent( this.name);
  }

  ngAfterViewInit(): void {}

  toggleSidebar(ind, tableId) {
    this.tableInd = ind;
    this.fixHeader = !this.fixHeader;
    this.opened[ind] = !this.opened[ind];
    this.selectedTbl = this.tableData.find(x => x.table_id === tableId);
  }

  markForExport(ind, tableId) {
    this.status[ind] = !this.status[ind];
    if (this.status[ind]) {
      this.markedTables.push(tableId);
    }
    this.tableCount = this.updateTableCount();
  }

  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }

  searchPdf(value: string) {
    this.pdfComponent.pdfFindController.executeCommand('find', {
      caseSensitive: false,
      findPrevious: undefined,
      highlightAll: true,
      phraseSearch: true,
      query: value
    });
  }

  /**
   * detect and pass the page number
   * @param e
   */
  pageRendered(e: CustomEvent) {
    const pageNo = (e as any).pageNumber;
    if (this.tableData !== undefined) {
      this.drawBoxes(pageNo);
    }

    if (this.totalPages === pageNo) {
      this.onBboxClick();
    }
  }

  updateTableCount() {
    const tablesCount = this.status.filter(table => {
      if (table) {
        return table;
      }
    });
    return tablesCount.length;
  }

  /**
   * draw rect with the relative co-ordinates converted to cope with canvas size
   * @param pageNo
   */
  drawBoxes(pageNo: any) {
    let page;
    let bbox;
    let xTl;
    let yTl;
    let wTl;
    let hTl;
    const tableDetails = this.tableData.filter(tbl => tbl.page === pageNo);

    if (tableDetails.length > 0) {
      for (const table of tableDetails) {
        page = table.page;
        bbox = table.bbox_relative;
        // console.log(bbox);
        // append div at calculated position
        const div = $('[data-page-number="' + page + '"]').find('.textLayer');
        $(div).attr('id', page);
        const wid = div.width();
        const hei = div.height();
        xTl = bbox[0] * wid;
        yTl = bbox[1] * hei;
        wTl = bbox[2] * wid;
        hTl = bbox[3] * hei;

        // todo:  convert to angular method
        $(div).append(
          $(
            '<div data-id="' +
              table.table_id +
              '"  id="' +
              table.table_id +
              '"/>'
          )
            .addClass('bbox')
            .css({
              left: xTl,
              top: yTl,
              width: wTl,
              height: hTl
            })
        );
      }
    }
  }

  onBboxClick() {
    const self = this;
    $('.bbox').on('click', function(e) {
      const tableId = $(this).prop('id');

      self.tableData.forEach((item, index) => {
        if (tableId === item.table_id) {
          self.toggleSidebar(index, item.table_id);
        }
      });
    });
  }

  initializeComponent( name ) {
    forkJoin(
      this.openSelFile.getSelectedFileMetaData(name).pipe(
        catchError(err => {
          alert(err.message);
          return throwError(err);
        }),
        map(resp => {
          const data = [];
          for (const key of Object.keys(resp)) {
            const val = resp[key];
            this.allTables.push(key);
            data.push({ ...val, name: key });
          }
          return data;
        })
      ),
      this.openSelFile.getPdfAsBlob(name).pipe(
        catchError(err => {
          alert(err.message);
          return throwError(err);
        })
      )
    ).subscribe(results => {
      this.tableData = results[0];
      const file = new Blob([results[1]], { type: 'application/pdf' });
      this.pdfData = URL.createObjectURL(file);
    });
  }
}
