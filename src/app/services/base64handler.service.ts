import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class base64HandlerService {
  // ? Started Working On Base64 Image Problem
  // ? Idea Is To Send Already Converted Base64 Image To Server
  // ? And Then Convert It To Image And Save It In Server
  // ? And Then Send Back The Image Back To Client
  // ? Put It In Quill Editor
  // ? By Ovveriding The Default Image Handler
  constructor(private http: HttpClient) {}

  uploadImage(base64Data: string): Observable<any> {
    const requestData = {
      image: base64Data,
    };

    return this.http.post('https://localhost:7189/Image', requestData);
  }
}
