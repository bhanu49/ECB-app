import { Component, OnInit } from '@angular/core';

import {
  faPlus,
  faFilePdf,
  faLock,
  faChartLine,
  faPlayCircle,
  faRedo,
  faTrashAlt,
  faUnlock,
  faFolderOpen
} from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit {
  faPlus = faPlus;
  faPdf = faFilePdf;
  faLock = faLock;
  faChart = faChartLine;
  faPlay = faPlayCircle;
  faRedo = faRedo;
  faTrash = faTrashAlt;
  faUnlock = faUnlock;
  faOpen = faFolderOpen;

  private selectedFile: File = null;

  uploadFiles = [
    {
      icon: this.faPdf,
      name: 'dummy1',
      lastRan: '',
      type: 'newFile'
    },
    {
      icon: this.faLock,
      name: 'dummy2',
      lastRan: '',
      type: 'locked'
    },
    {
      icon: this.faChart,
      name: 'dummy3',
      lastRan: '',
      type: 'analyzed'
    }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  onFileChange(event) {
    this.selectedFile = event.target.files[0] as File;
    this.uploadFile();
    console.log(this.selectedFile);
  }

  uploadFile() {
    const uploadData = new FormData();
    uploadData.append('uploadFile', this.selectedFile, this.selectedFile.name);

    const data = {
      icon: this.faPdf,
      name: this.selectedFile.name,
      lastRan: '',
      type: 'newFile'
    };

    this.uploadFiles.push(data);

    // handel uploads

    this.http.post('/api/upload', uploadData, {
       reportProgress: true,
       observe: 'events'
     }).subscribe(event => {
       console.log(event);
     });
  }

  unlockAndRun() {
    console.log('clicked');
  }

  runAnalysis() {}

  unlockFile() {}

  openFile() {}

  reRunAnalysis() {}
}
