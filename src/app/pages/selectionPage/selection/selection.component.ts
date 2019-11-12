import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../../../restUtils/shared/rest.service';
import { RemoveComponent } from '../remove/remove.component';
import { catchError, finalize, map } from 'rxjs/operators';

import {
  faChartLine,
  faFilePdf,
  faFolderOpen,
  faLock,
  faPauseCircle,
  faPlayCircle,
  faPlus,
  faRedo,
  faStopCircle,
  faTrashAlt,
  faUnlock
} from '@fortawesome/free-solid-svg-icons';

import { Router } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { forkJoin, of, throwError } from 'rxjs';
import { Tile } from './tile';
import { NgForm } from '@angular/forms';

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
  unlockWithRun = [];
  runFileAnalysis = [];
  reRunFileAnalysis = [];
  public tileModel: Tile;

  public tileId: number;
  invalidPw = [];
  showProgressBar = [];
  progressFeedback: number;
  private progressBar: any;
  unlock = [];
  constructor(private restUtils: RestService, private router: Router) {}

  ngOnInit() {
    this.restUtils
      .getFilesData()
      .pipe(
        map(resp => {
          // console.log(resp);
          const fileData = [];
          let ind = 0;
          for (const key in resp) {
            ind++;
            const i = resp[key];
            if (i.locked && !i.processed) {
              fileData.push({
                ...i,
                icon: this.faLock,
                name: key,
                type: 'locked',
                id: ind
              });
            } else if (!i.locked && i.processed) {
              fileData.push({
                ...i,
                icon: this.faChart,
                name: key,
                type: 'analyzed',
                id: ind
              });
            } else if (i.locked && i.processed) {
              fileData.push({
                ...resp[key],
                icon: this.faLock,
                name: key,
                type: 'locked',
                id: ind
              });
            } else if (!i.processed && !i.locked) {
              fileData.push({
                ...resp[key],
                icon: this.faPdf,
                name: key,
                id: ind,
                type: 'newFile'
              });
            }
          }
          return fileData;
        })
      )
      .subscribe(response => {
        // console.log(response);
        this.displayFiles = response;
      });
  }

  /**
   * fetches the user selected file
   * @param files
   */
  onFileChange(files: FileList) {
    const requests = [];

    // this.uploadFile(files[i])
    for (let i = 0; i < files.length; i++) {
      requests.push(this.restUtils.postUploadedFile(files[i]));
    }

    this.tileModel = new Tile();

    forkJoin([...requests]).subscribe(
      results => {
        for (const resp of results) {
          this.addTile(resp);
        }
      },
      catchError(err => {
        alert(err.message);
        return throwError(err);
      })
    );
  }

  unlockAndRun(ind) {
    this.unlockWithRun[ind] = !this.unlockWithRun[ind];
  }

  unlockFileWithRun(form, id, ind, filename) {
    const selectedFile = this.displayFiles.find(x => x.id === id);
    selectedFile.key = form.value.password;

    this.restUtils
      .addKeyToFile(filename, form.value.password)
      .pipe(
        catchError(err => {
          alert(err.message);
          this.unlockWithRun[ind] = !this.unlockWithRun[ind];
          return throwError(err);
        })
      )
      .subscribe(resp => {
        // console.log(resp);
        this.restUtils
          .runFile(filename)
          .pipe(
            catchError(err => {
              alert(err.message);
              return throwError(err);
            })
          )
          .subscribe(el => {
            if (el.type === HttpEventType.DownloadProgress) {
              // console.log(Math.round(resp.loaded / resp.total * 100));
            } else if (el.type === HttpEventType.Response) {
              if (el.status === 201 || el.status === 200) {
                this.progressFeedback = 101;
              } else {
                alert('Run failed');
              }
            }
          });
      });

    this.progressBar = this.progressAnimate(id, 'unlock', ind);
    this.showProgressBar[ind] = true;
  }

  openFile(name: string) {
    // navigate to editor
    this.router
      .navigate(['/editor', name])
      .then(r => console.log('Editor page:' + r));
  }

  runAnalysis(ind: number, name: string, id: number) {
    this.runFileAnalysis[ind] = !this.runFileAnalysis[ind];
    this.restUtils
      .runFile(name)
      .pipe(
        catchError(err => {
          alert(err.message);
          this.runFileAnalysis[ind] = !this.runFileAnalysis[ind];
          return throwError(err);
        })
      )
      .subscribe(resp => {
        if (resp.type === HttpEventType.DownloadProgress) {
          // console.log(Math.round(resp.loaded / resp.total * 100));
        } else if (resp.type === HttpEventType.Response) {
          if (resp.status === 201 || resp.status === 200) {
            this.progressFeedback = 101;
          } else {
            this.runFileAnalysis[ind] = !this.runFileAnalysis[ind];
            alert('Run failed');
          }
        }
      });
    this.progressBar = this.progressAnimate(id, 'run', ind);
  }

  reRunAnalysis(ind: number, name: string, id: number) {
    this.reRunFileAnalysis[ind] = !this.reRunFileAnalysis[ind];
    this.restUtils.runFile(name).subscribe(resp => {
      console.log(resp);
    });
    this.progressBar = this.progressAnimate(id, 'rerun', ind);
  }

  removeTile(el) {
    // get the id of tile and pass it to remove component
    this.tileId = el.target.getAttribute('data-tile-id');
    this.removeModal.show();
  }

  changeTile(id: number, type: string, tileInd: number) {
    if (type === 'rerun') {
      this.reRunFileAnalysis[tileInd] = !this.reRunFileAnalysis[tileInd];
    } else {
      this.displayFiles.forEach((el, ind) => {
        if (id === el.id) {
          switch (type) {
            case 'rerun': {
              el.icon = this.faChart;
              el.type = 'analyzed';
              break;
            }
            case 'newFile': {
              el.icon = this.faPdf;
              el.type = 'newFile';
              break;
            }
            case 'unlock': {
              el.icon = this.faPdf;
              el.type = 'newFile';
              break;
            }
            case 'run': {
              el.icon = this.faChart;
              el.type = 'analyzed';
              break;
            }
          }
        }
      });
    }
  }

  progressAnimate(id, type: string, ind) {
    const self = this;
    this.progressFeedback = 10;
    const t = setInterval(() => {
      if (self.progressFeedback < 90) {
        self.progressFeedback = (++self.progressFeedback % 360) + 1;
      } else if (self.progressFeedback > 100) {
        this.changeTile(id, type, ind);
        clearInterval(t);
      }
    }, 100);
  }

  unlockPdf(i: number) {
    this.unlock[i] = !this.unlock[i];
  }

  unlockFile(u: NgForm, id: any, i: number, name: any) {
    const selectedFile = this.displayFiles.find(x => x.id === id);
    if (selectedFile.key === u.value.password) {
      this.invalidPw[i] = false;
      this.showProgressBar[i] = true;
      this.progressBar = this.progressAnimate(id, 'newFile', i);
      this.progressFeedback = 101;
    } else {
      this.invalidPw[i] = true;
    }
  }

  addTile(resp) {
    if (resp.status === 200 || resp.status === 201) {
      const body = JSON.parse(resp.body);
      const fileName = Object.keys(body);
      if (!body.locked && body.processed) {
        this.tileModel.icon = this.faLock;
        this.tileModel.type = 'locked';
      } else if (body.locked && !body.processed) {
        this.tileModel.icon = this.faChart;
        this.tileModel.type = 'analyzed';
      } else if (body.processed && body.locked) {
        this.tileModel.icon = this.faLock;
        this.tileModel.type = 'locked';
      } else if (!body.processed && !body.locked) {
        this.tileModel.icon = this.faPdf;
        this.tileModel.type = 'newFile';
      }
      this.tileModel.id = Math.floor(Math.random() * 100);
      this.tileModel.name = fileName[0];
      this.tileModel.key = body.key;
      this.tileModel.last_modified = body.last_modified;

      // console.log(this.displayFiles);
      this.displayFiles.push(this.tileModel);
    } else {
      alert('upload failed');
    }
  }
}
