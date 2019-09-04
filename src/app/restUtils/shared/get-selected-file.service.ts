import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetSelectedFileService {
  constructor(private http: HttpClient) {}

  openSelectedFile(name: string) {
    return this.http.get('/api/selected/' + name);
  }
}
