import { Injectable, inject, signal } from "@angular/core";
import { finalize } from "rxjs";
import { UserProfile } from "../models/user-profile.model";
import { ProfileRepository } from "./profile.repository";

@Injectable({ providedIn: 'root' })
export class ProfileFacade {
  private repository = inject(ProfileRepository);

  // State
  private profileState = signal<UserProfile | null>(null);
  private loadingState = signal(false);

  // Selectors
  readonly profile = this.profileState.asReadonly();
  readonly isLoading = this.loadingState.asReadonly();

  loadProfile() {
    this.loadingState.set(true);
    this.repository.getProfile().pipe(
      finalize(() => this.loadingState.set(false))
    ).subscribe(data => this.profileState.set(data));
  }

  saveProfile(updatedData: UserProfile) {
    this.loadingState.set(true);
    return this.repository.updateProfile(updatedData).pipe(
      finalize(() => this.loadingState.set(false))
    );
  }
}