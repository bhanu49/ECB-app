import { Component, OnInit } from '@angular/core';
import { UploadService } from '../restUtils/shared/upload.service';
import { map } from 'rxjs/operators';

import {
  faPlus,
  faFilePdf,
  faLock,
  faChartLine,
  faPlayCircle,
  faRedo,
  faTrashAlt,
  faUnlock,
  faFolderOpen, faPauseCircle, faStopCircle
} from '@fortawesome/free-solid-svg-icons';

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
  faPause = faPauseCircle;
  faStop = faStopCircle;
  private selectedFile: File = null;

  displayFiles: any;
  unlockWithRun = false;
  runFileAnalysis = false;
  reRunFileAnalysis = false;

  constructor(private upSvc: UploadService) {}

  ngOnInit() {
    this.upSvc
      .getFilesData()
      .pipe(
        map(resp => {
          const fileData = [];
          for (const key in resp) {
            if (resp[key].type === 'newFile') {
                fileData.push({ ...resp[key], icon: this.faPdf });
              }
            if (resp[key].type === 'locked') {
                fileData.push({ ...resp[key], icon: this.faLock });
              }
            if (resp[key].type === 'analyzed') {
                fileData.push({ ...resp[key], icon: this.faChart });
              }
          }
          return fileData;
        })
      )
      .subscribe(response => {
        this.displayFiles = response;
      });
  }

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

    this.displayFiles.push(data);
    this.upSvc.postUploadedFile('/api/upload', uploadData);
  }

  unlockAndRun() {
    this.unlockWithRun = !this.unlockWithRun;
  }

  runAnalysis() {
    this.runFileAnalysis = !this.runFileAnalysis;
  }

  unlockFile() {}

  openFile() {}

  reRunAnalysis() {
    this.reRunFileAnalysis = !this.reRunFileAnalysis
  }
}
