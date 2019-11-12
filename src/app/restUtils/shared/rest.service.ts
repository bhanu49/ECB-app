import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  basePath = 'http://localhost:8082';
  constructor(private http: HttpClient) {}

  postUploadedFile(data: any) {
    const formData: FormData = new FormData();
    formData.append('file', data, data.name);
    const url = this.basePath + '/add_file';
    if (data.name !== '' || data.name !== null) {
      return this.http.post(url, formData, {
        reportProgress: true,
        observe: 'response',
        responseType: 'text'
      });
    }
  }

  getFilesData() {
    return this.http.get(this.basePath + '/selection');
  }

  deleteFile(name: string) {
    return this.http.delete(this.basePath + '/remove_document/' + name, {
      responseType: 'text'
    });
  }

  runFile(name: string) {
    return this.http.get(this.basePath + '/run/' + name, {
      responseType: 'text',
      reportProgress: true,
      observe: 'events'
    });
  }

  rerunFileAnalysis(reqBody, name: string) {
    const url = this.basePath + '/re-run/' + name;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const body = JSON.stringify(reqBody);
    return this.http.post(url, body, httpOptions);
  }

  runMultipleFiles(list) {
    const url = this.basePath + '/run_list';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const body = JSON.stringify(list);
    return this.http.post(url, body, httpOptions);
  }

  runAllUnlocked() {
    const url = this.basePath + '/run-all';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, null , httpOptions);
  }

  downloadTableXls(name) {
    return this.http.get(this.basePath + '/download/' + name, {
      responseType: 'blob'
    });
  }

  addKeyToFile(name: string, password: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const body = JSON.stringify({ key: password });
    const url = this.basePath + '/add_key/' + name;
    return this.http.post(url, body, httpOptions);
  }


  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}
