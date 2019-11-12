import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() searchStr = new EventEmitter<string>();
  @Input() public displayAttr;

  faSearch = faSearch;

  constructor() {}

  ngOnInit() {}

  startSearch(value: string) {
    this.searchStr.next(value);
  }
}
