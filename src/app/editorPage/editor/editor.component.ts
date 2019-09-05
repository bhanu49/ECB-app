import { Component, OnInit } from '@angular/core';
import { GetSelectedFileService } from '../../restUtils/shared/get-selected-file.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  name: string;
  constructor(
    private openSelFile: GetSelectedFileService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.name = params.id;
      }
    );
    console.log(this.name);
    const dummyName = 'name';
    // use this.name instead of dummy name
    this.openSelFile.openSelectedFile(dummyName).subscribe(resp => {
      console.log(resp);
    });
  }
}
