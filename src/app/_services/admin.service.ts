import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DATINGAPP_API_URL } from '../app.config';
import { User } from '../_models/user';
let token = localStorage.getItem("token");
const headers = { 'Authorization': 'Bearer ' + token };
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getUsersWithRoles() {

    return this.http.get(`${DATINGAPP_API_URL}/admin/users-with-roles`, { headers });
  }

  updateUserRoles(user: User, roles: any) {
    return this.http.post(`${DATINGAPP_API_URL}/admin/edit-roles/${user.userName}`, roles, { headers });
  }

  getPhotosForApproval() {
    return this.http.get(`${DATINGAPP_API_URL}/admin/photos-for-moderation`, { headers });
  }

  approvePhoto(photoId) {
    return this.http.post(`${DATINGAPP_API_URL}/admin/approve-photo/${photoId}`, { headers });
  }

  rejectPhoto(photoId) {
    return this.http.post(`${DATINGAPP_API_URL}/admin/reject-photo/${photoId}`, { headers });
  }
}
