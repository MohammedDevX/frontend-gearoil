import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProfileFacade } from '../data-access/profile.facade';
import { UserProfile } from '../models/user-profile.model';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.scss'],
  imports: [ReactiveFormsModule]
})
export class EditProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  protected facade = inject(ProfileFacade);
  private destroyRef = inject(DestroyRef);
  private profile$ = toObservable(this.facade.profile);

  // 1. Initialize empty form
  profileForm = this.fb.group({
    Nom: ['', [Validators.required]],
    Prenom: ['', [Validators.required]],
    Email: ['', [Validators.required, Validators.email]],
    UserName: ['', [Validators.required]]
  });

  ngOnInit() {
    // 2. Request old data when component loads
    this.facade.loadProfile();

    // 3. Fill the form when data arrives
    this.profile$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      if (data) {
        this.profileForm.patchValue(data);
      }
    });
  }

  onSave() {
    if (this.profileForm.valid) {
      const payload = { ...this.facade.profile(), ...this.profileForm.value } as UserProfile;

      this.facade.saveProfile(payload).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: () => {
          alert('Saved successfully!');
          this.profileForm.markAsPristine(); // Reset "changed" indicators
        },
        error: (err) => {
          console.error(err);
          alert('Failed to save profile!');
        }
      });
    }
  }
}