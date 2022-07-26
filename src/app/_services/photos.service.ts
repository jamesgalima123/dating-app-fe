import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DATINGAPP_API_URL } from '../app.config';
let token = localStorage.getItem("token");
const headers = { 'Authorization': 'Bearer ' + token };
@Injectable({
  providedIn: 'root'
})
export class PhotosService {

  constructor(private http: HttpClient) { }

  setMainPhoto(photoId: number) {
    return this.http.put(`${DATINGAPP_API_URL}/photos/${photoId}/set-main`, { headers });
  }

  deleteUserPhoto(photoId: number) {
    return this.http.delete(`${DATINGAPP_API_URL}/photos/${photoId}`, { headers });
  }
}
