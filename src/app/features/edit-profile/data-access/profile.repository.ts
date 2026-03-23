import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { UserProfile } from "../models/user-profile.model";

@Injectable({ providedIn: 'root' })
export class ProfileRepository {
  private http = inject(HttpClient);
  // Matches the same /api proxy pattern used by auth.service.ts
  private API_BASE = '/api/profile';

  getProfile() {
    return this.http.get<UserProfile>(`${this.API_BASE}`);
  }

  updateProfile(data: UserProfile) {
    return this.http.patch<void>(`${this.API_BASE}`, data);
  }
}