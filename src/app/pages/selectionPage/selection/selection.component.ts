import {Component , OnInit,  ViewChild} from '@angular/core';
import { UploadService } from '../../../restUtils/shared/upload.service';
import { RemoveComponent } from '../remove/remove.component';
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
  faFolderOpen,
  faPauseCircle,
  faStopCircle
} from '@fortawesome/free-solid-svg-icons';

import { Router } from '@angular/router';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit {
  @ViewChild(RemoveComponent, { static: false }) removeModal: RemoveComponent;

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
  displayFiles: any;
  unlockWithRun = false;
  runFileAnalysis = false;
  reRunFileAnalysis = false;

  private selectedFile: File = null;
  private tileId: number;

  constructor(
    private upSvc: UploadService,
    private router: Router
  ) {}

  ngOnInit() {
    this.upSvc
      .getFilesData()
      .pipe(
        map(resp => {
          const fileData = [];
          for (const key in resp) {
            const i = resp[key];
            if (!i.locked && i.processed) {
              fileData.push({
                ...i,
                icon: this.faPdf,
                name: key,
                type: 'newFile'
              });
            }
            if (i.locked && !i.processed) {
              fileData.push({
                ...resp[key],
                icon: this.faLock,
                name: key,
                type: 'locked'
              });
            }
            if (!i.processed && !i.locked) {
              fileData.push({
                ...resp[key],
                icon: this.faChart,
                name: key,
                type: 'analyzed'
              });
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
  }

  uploadFile() {
    const uploadData = new FormData();
    uploadData.append('uploadFile', this.selectedFile, this.selectedFile.name);

    const data = {
      icon: this.faPdf,
      name: this.selectedFile.name,
      lastRan: '',
      type: 'newFile',
      key: Math.floor(Math.random() * 100)
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

  unlockFile(form, key) {
    const selectedFile = this.displayFiles.find(x => x.id === key);
    console.log(form);
    if (selectedFile.key === form.value.password) {
      // show progress bar and hide input
      console.log('unlock file');
    }
  }

  openFile(name: string) {
    // navigate to editor
    this.router.navigate(['/editor', name]).then(r => console.log('Editor page:' + r));
  }

  reRunAnalysis() {
    this.reRunFileAnalysis = !this.reRunFileAnalysis;
  }

  removeTile(el) {
    // get the id of tile and pass it to remove component
    this.tileId = el.target.getAttribute('data-tile-id');
    this.removeModal.show();
  }
}
