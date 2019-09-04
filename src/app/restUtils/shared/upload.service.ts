import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(private http: HttpClient) {}

  postUploadedFile(url: string, data: any) {
    this.http
      .post(url, data, {
        reportProgress: true,
        observe: 'events'
      })
      .subscribe(resp => {
        console.log(resp);
      });
  }

  getFilesData() {
    return this.http.get('/api/files');
  }
}