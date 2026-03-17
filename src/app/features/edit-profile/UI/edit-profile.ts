import { Component, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProfileFacade } from '../data-access/profile.facade';
import { UserProfile } from '../models/user-profile.model';

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
    effect(() => {
      const data = this.facade.profile();
      if (data) {
        this.profileForm.patchValue(data);
      }
    });
  }

  onSave() {
    if (this.profileForm.valid) {
      const payload = { ...this.facade.profile(), ...this.profileForm.value } as UserProfile;

      this.facade.saveProfile(payload).subscribe({
        next: () => {
          alert('Saved successfully!');
          this.profileForm.markAsPristine(); // Reset "changed" indicators
        }
      });
    }
  }
}