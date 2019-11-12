import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalRef
} from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../../restUtils/shared/rest.service';

@Component({
  selector: 'app-remove',
  templateUrl: './remove.component.html',
  styleUrls: ['./remove.component.scss']
})
export class RemoveComponent implements OnInit {
  fileName: string;
  @ViewChild('removeModal', { static: true }) public removeModal;

  @Input() public tileId;
  @Input() public allFiles;

  private closeModal: string;
  private modalReference: NgbModalRef;

  constructor(private restUtils: RestService, private modalService: NgbModal) {}

  private static getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit() {}

  show() {
    this.modalReference = this.modalService.open(this.removeModal, {
      centered: true
    });
    this.modalReference.result.then(
      result => {
        this.closeModal = `Closed with: ${result}`;
      },
      reason => {
        this.closeModal = `Dismissed ${RemoveComponent.getDismissReason(
          reason
        )}`;
      }
    );
  }

  removeTile($event: MouseEvent) {
    document.body
      .querySelector('.tileWrap[data-id="' + this.tileId + '"]')
      .remove();
    this.modalReference.close('successfully removed');
    this.allFiles.forEach((el, ind) => {
      if (Number(this.tileId) === el.id) {
        this.fileName = el.name;
      }
    });

    this.restUtils
      .deleteFile(this.fileName)
      .subscribe(data => {
       // alert(data);
      });
  }
}
