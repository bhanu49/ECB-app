import {Component, OnInit} from '@angular/core';
import {faPlus} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit {
  faPlus = faPlus;

  constructor() {
  }

  ngOnInit() {
  }

}
