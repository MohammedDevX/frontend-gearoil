import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProfileFacade } from '../data-access/profile.facade';
import { UserProfile } from '../models/user-profile.model';
import { NotificationService } from '../../../core/services/notification.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class EditProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  protected facade = inject(ProfileFacade);
  private notify = inject(NotificationService);
  private destroyRef = inject(DestroyRef);
  private profile$ = toObservable(this.facade.profile);

  profileForm = this.fb.group({
    nom: ['', [Validators.required]],
    prenom: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    userName: ['', [Validators.required]]
  });

  ngOnInit() {
    this.facade.loadProfile();

    this.profile$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      if (data) {
        // Now matches camelCase from backend: nom, prenom, email, userName
        this.profileForm.patchValue(data);
      }
    });
  }

  /**
   * Returns true if the current form field value differs from the original data in the facade.
   * This is more accurate than control.dirty, as it handles the "change back to original" case.
   */
  isModified(field: keyof UserProfile): boolean {
    const current = this.profileForm.get(field)?.value;
    const original = (this.facade.profile() as any)?.[field];
    
    // Simple comparison for strings/numbers. 
    // If the data is null/undefined, treat it as empty string for comparison.
    return (current ?? '') !== (original ?? '');
  }

  onSave() {
    if (this.profileForm.invalid) return;

    // Merge form values with existing profile data
    const payload = { ...this.facade.profile(), ...this.profileForm.value } as UserProfile;

    this.facade.saveProfile(payload).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.notify.success('Profile saved successfully!');
        this.profileForm.markAsPristine();
      },
      error: (err: any) => {
        this.notify.error(err);
      }
    });
  }
}