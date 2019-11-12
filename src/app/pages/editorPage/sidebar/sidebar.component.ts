import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faEyeDropper, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { NgForm } from '@angular/forms';
import { TracerService } from '../tracer.service';
import { RestService } from '../../../restUtils/shared/rest.service';
import { ActivatedRoute, Params } from '@angular/router';
import { catchError } from 'rxjs/operators';
import {forkJoin, throwError} from 'rxjs';
declare let $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() public tableID;
  @Input() public tableArray;
  @Output() reloadComponent = new EventEmitter<string>();

  faInfo = faInfoCircle;
  faEyeDropper = faEyeDropper;
  color1 = '#008fcc';
  color2 = '#aedbef';
  tracerAdded = false;

  type = ['stream', 'lattice'];
  private fileName: any;
  private counter = 1;
  constructor(
    private tracer: TracerService,
    private restUtils: RestService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.fileName = params.id;
    });
  }

  public changeLineClr(event: string, data: any): void {
    if (event === 'colorPickerClose') {
      this.color1 = data;
    }
  }

  public changeBackgroundClr(event: string, data: any): void {
    if (event === 'colorPickerClose') {
      this.color2 = data;
    }
  }

  rerunFileAnalysis(form: NgForm) {
    const body = { ...this.tableArray };
    let bboxRel: any;

    // get the details of tracer box
    const tracerData = $('.editedBox')
      .map(function() {
        const obj: { [k: string]: any } = {};
        obj.tracerId = $(this).data('tracer-id');
        obj.position = $(this).position();
        obj.width = $(this).width();
        obj.height = $(this).height();
        return obj;
      })
      .get();

    if (tracerData && tracerData.length > 0) {
      const currentTable = tracerData.find(x => x.tracerId === body.table_id);
      const tracerBox = $(
        '[data-tracer-id="' + currentTable.tracerId + '"]'
      ).parents();
      const textLayer = $(tracerBox).find('.textLayer');
      const width = $(textLayer).width();
      const height = $(textLayer).height();

      bboxRel = [
        currentTable.position.left / width,
        currentTable.position.top / height,
        currentTable.width / width,
        currentTable.height / height
      ];
    }
    body.Is_first_line_of_table = form.value.isFirstLine;
    if (body.number_of_columns !== form.value.colNum) {
      body.number_of_columns = form.value.colNum;
    } else {
      body.number_of_columns = null;
    }
    if (body.number_of_rows !== form.value.rowNum) {
      body.number_of_rows = form.value.rowNum;
    } else {
      body.number_of_rows = null;
    }
    body.number_of_rows = form.value.rowNum;
    body.line_color = true;
    body.form_type = form.value.streamType;
    if (bboxRel && bboxRel.length > 0) {
      body.bbox_relative = bboxRel;
    }

    this.restUtils
      .rerunFileAnalysis(body, this.fileName)
      .pipe(
        catchError(err => {
          alert(err.message);
          return throwError(err);
        })
      )
      .subscribe(response => {
        // todo: add logic to check the status
        this.refreshView(this.fileName);
      });

    this.checkForNewBbox(body.page);
  }

  editTracingBox(e: MouseEvent) {
    e.preventDefault();
    const bbox = $('[data-id="' + this.tableArray.table_id + '"]');
    const parentId = $(bbox)
      .parents()
      .attr('id');

    if (parentId !== undefined) {
      $('#' + parentId).append(
        '<div class="popup editedBox" data-tracer-id="' +
          this.tableArray.table_id +
          '">' +
          '  <div class="popup-header">Click here to move</div>\n' +
          '</div>'
      );
      $(bbox).remove();
      this.tracer.initDragElement();
      this.tracer.initResizeElement();
    }

    this.tracerAdded = true;
  }

  refreshView(name) {
    this.reloadComponent.emit(name);
  }

  addTracingBox($event: MouseEvent) {
    $event.preventDefault();
    const page = $('[data-page-number="' + this.tableArray.page + '"]').find(
      '.textLayer'
    );

    const id = 'tracer' + this.counter;
    $(page).append(
      '<div class="popup newBbox" data-tracer-id="' +
        id +
        '"  >' +
        '  <div class="popup-header">Click here to move</div>\n' +
        '</div>'
    );
    this.counter++;
    this.tracer.initDragElement();
    this.tracer.initResizeElement();
  }

  /**
   * logic to get newly added boxes and post the data
   * @param pageNo
   */
  private checkForNewBbox(pageNo: number) {
    const width = $('.textLayer').width();
    const height = $('.textLayer').height();
    const requests = [];
    const newBboxData = $('.newBbox')
      .map(function() {
        const obj: { [k: string]: any } = {};
        obj.tracerId = $(this).data('tracer-id');
        obj.position = $(this).position();
        obj.width = $(this).width();
        obj.height = $(this).height();
        return obj;
      })
      .get();

    if (newBboxData && newBboxData.length > 0) {
      for (const bbox of newBboxData) {
        const bboxRel = [
          bbox.position.left / width,
          bbox.position.top / height,
          bbox.width / width,
          bbox.height / height
        ];

        requests.push(
          this.restUtils
            .rerunFileAnalysis({
              bbox_relative: bboxRel,
              page: pageNo,
              form_type: 'stream'
            }, this.fileName)
          );
      }
    }

    forkJoin([...requests]).subscribe(
      resp => {
        console.log(resp);
        this.refreshView(this.fileName);
      },
      catchError(err => {
        alert(err.message);
        return throwError(err);
      })
    );
  }
}
