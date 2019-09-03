import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  clientId =
    '405854376236-6kqnrqhaacbrsj0ah1dm7nf8fg5labm9.apps.googleusercontent.com';
  clientSecret = 'Y8uOq6S8Za_fbZ2ZO9UDaCV6';
  scope = 'https://www.googleapis.com/auth/drive';
  url = '';

  constructor() {}

  postUploadedFile() {

  }
}
