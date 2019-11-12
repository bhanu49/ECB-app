import { Component, Input, OnInit } from '@angular/core';
import { RestService } from '../../../restUtils/shared/rest.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TracerService } from '../tracer.service';
declare let $: any;

@Component({
  selector: 'app-editor-footer',
  templateUrl: './editor-footer.component.html',
  styleUrls: ['./editor-footer.component.scss']
})
export class EditorFooterComponent implements OnInit {
  constructor(private restUtils: RestService, private tracer: TracerService) {}

  @Input() public tables;
  @Input() public allTables;
  @Input() public status;
  @Input() public tableCount;

  counter = 1;

  ngOnInit() {}

  exportTables() {
    const tableNames = Array.prototype.map.call(
      document.getElementsByClassName('innerTableWrap'),
      el => el.id
    );

    for (const table of tableNames) {
      this.restUtils
        .downloadTableXls(table)
        .pipe(
          catchError(err => {
            alert(err.message);
            return throwError(err);
          })
        )
        .subscribe(data => {
          const downloadURL = window.URL.createObjectURL(data);
          const link = document.createElement('a');
          link.href = downloadURL;
          link.download = 'table';
          link.click();
        });
    }
  }

  markAllTables() {
    for (const ind in this.allTables) {
      if (this.allTables.hasOwnProperty(ind)) {
        this.status[ind] = true;
      }
    }
    this.tableCount = this.allTables.length;
  }

}
