import { Injectable, inject, signal } from "@angular/core";
import { finalize } from "rxjs";
import { UserProfile } from "../models/user-profile.model";
import { ProfileRepository } from "./profile.repository";
import { NotificationService } from "../../../core/services/notification.service";

@Injectable({ providedIn: 'root' })
export class ProfileFacade {
  private repository = inject(ProfileRepository);
  private notify = inject(NotificationService);

  // State
  private profileState = signal<UserProfile | null>(null);
  private loadingState = signal(false);
  private errorState = signal<string | null>(null);

  // Selectors
  readonly profile = this.profileState.asReadonly();
  readonly isLoading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  loadProfile() {
    this.loadingState.set(true);
    this.errorState.set(null);
    this.repository.getProfile().pipe(
      finalize(() => this.loadingState.set(false))
    ).subscribe({
      next: (data) => this.profileState.set(data),
      error: (err) => {
        const msg = 'Failed to load profile.';
        this.errorState.set(msg);
        this.notify.error(err, 'Profile Error');
      }
    });
  }

  saveProfile(updatedData: UserProfile) {
    this.loadingState.set(true);
    return this.repository.updateProfile(updatedData).pipe(
      finalize(() => this.loadingState.set(false))
    );
  }
}