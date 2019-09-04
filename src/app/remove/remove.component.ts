import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ModalDismissReasons, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { UploadService } from '../restUtils/shared/upload.service';

@Component({
  selector: 'app-remove',
  templateUrl: './remove.component.html',
  styleUrls: ['./remove.component.scss']
})
export class RemoveComponent implements OnInit {
  @ViewChild('removeModal', { static: true }) public removeModal;

  @Input() public tileId;
  private closeModal: string;
  private modalReference: NgbModalRef;

  constructor(private upSvc: UploadService, private modalService: NgbModal) {}

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
    document.body.querySelector('.tileWrap[data-id="' + this.tileId + '"]').remove();
    this.modalReference.close('successfully removed');
    // todo: api call to remove analysis form backend
  }
}
