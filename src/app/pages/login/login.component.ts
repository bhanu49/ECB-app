import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  @ViewChild('loginModal', { static: true }) private loginModal;

  modalOptions: NgbModalOptions = {
    backdrop : 'static',
    keyboard: false,
    centered: true
  };
  private closeResult: string;
  private modalReference: NgbModalRef;

  constructor( private router: Router,
               private modalService: NgbModal,
               private http: HttpClient) {

  }

  ngOnInit() {
    this.openLoginModal(this.loginModal);
  }

  openLoginModal(modal) {
    this.modalReference = this.modalService.open(modal, this.modalOptions);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onLoginSubmit(formVal) {
    const formInputs = formVal.value;
    console.log(formInputs);
    if (formVal.valid) {
      this.modalReference.close('passed');
      this.getUserData();
      this.goToHome();
    }
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  getDismissReason(reason: any) {
      return  `with: ${reason}`;
  }

  getUserData() {
    this.http.get(
      'http://localhost:3001/user'
    ).subscribe(response => {
      console.log(response);
    });
  }
}
