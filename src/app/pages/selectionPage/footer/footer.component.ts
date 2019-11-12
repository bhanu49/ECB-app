import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  NgbModal,
  NgbModalOptions,
  NgbModalRef
} from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../../restUtils/shared/rest.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @ViewChild('selectModal', { static: true }) private selectModal;
  @Input() public fileList;

  private modalReference: NgbModalRef;
  private closeResult: string;

  modalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg',
    windowClass: 'selectModal'
  };
  public selectAll: boolean;
  constructor(private modalService: NgbModal, private restUtils: RestService) {}

  ngOnInit() {}

  openSelectFileModal() {
    this.openSelectModal(this.selectModal);
  }

  openSelectModal(modal) {
    this.modalReference = this.modalService.open(modal, this.modalOptions);
    this.modalReference.result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  getDismissReason(reason: any) {
    return `with: ${reason}`;
  }

  selectAllFiles() {
    this.selectAll = !this.selectAll;
    for (let i = 0; i < this.fileList.length; i++) {
      this.fileList[i].checked = this.selectAll;
    }
  }

  batchRun() {
    this.modalReference.close('save');
    let selectedFiles;
    const files = [];
    if (this.selectAll) {
      selectedFiles = this.fileList.filter(file => file.locked === false);
    } else {
      selectedFiles = this.fileList.filter(file => file.checked === true);
    }
    for (const name of selectedFiles) {
      files.push(name.name);
    }

    this.restUtils
      .runMultipleFiles(files)
      .pipe(
        catchError(err => {
          alert(err.message);
          return throwError(err);
        })
      )
      .subscribe(response => {
        console.log(response);
      });
  }

  checkIfAllSelected() {
    let totalSelected = 0;
    for (let i = 0; i < this.fileList.length; i++) {
      if (this.fileList[i].selected) {
        totalSelected++;
      }
    }
    this.selectAll = totalSelected === this.fileList.length;
    return true;
  }

  runAllFiles() {
    alert('Analysis started')
    this.restUtils
      .runAllUnlocked()
      .pipe(
        catchError(err => {
          alert(err.message);
          return throwError(err);
        })
      )
      .subscribe(response => {
        console.log(response);
      });
  }
}
