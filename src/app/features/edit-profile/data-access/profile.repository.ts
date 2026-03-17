import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { UserProfile } from "../models/user-profile.model";

@Injectable({ providedIn: 'root' })
export class ProfileRepository {
  private http = inject(HttpClient);
  private API_BASE = 'https://api.myapp.com/profile';

  getProfile() {
    return this.http.get<UserProfile>(`${this.API_BASE}/me`);
  }

  updateProfile(data: UserProfile) {
    return this.http.put<void>(`${this.API_BASE}/update`, data);
  }
}