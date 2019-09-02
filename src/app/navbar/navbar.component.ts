import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() public isUserLoggedIn: boolean;

  constructor() { }

  ngOnInit() {
  }

  appLogout() {
    console.log('logged off');
    // application Logout handling
  }
}
