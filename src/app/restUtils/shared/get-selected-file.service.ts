import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import { map, flatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GetSelectedFileService {
  basePath = 'http://localhost:8082';

  constructor(private http: HttpClient) {}

  /*openSelectedFile(name: string) {
    return this.http.get(this.basePath + '/open-file/' + name);
  }*/

  getSelectedFileMetaData(name: string) {
    return this.http.get(this.basePath + '/open/' + name);
  }

  getPdfAsBlob(name) {
    return this.http.get(this.basePath + '/open-file/' + name, {
      responseType: 'blob'
    });
  }

}
