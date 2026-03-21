import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-activate-admin',
  imports: [FormsModule],
  templateUrl: './test.html'
})
export class ActivateAdminComponent implements OnInit {

  userId!: string;
  token!: string;

  password = '';
  confirmPassword = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    this.userId = this.route.snapshot.queryParamMap.get('userId')!;
    this.token = this.route.snapshot.queryParamMap.get('token')!;

  }

  activate() {

    if(this.password !== this.confirmPassword){
      alert("Passwords do not match");
      return;
    }

    const body = {
      userId: this.userId,
      token: this.token,
      Mot_passe: this.password,
      Comfirmation_pass: this.confirmPassword
    };

    this.http.patch(
      "http://localhost:5000/auth",
      body
    ).subscribe({
      next: () => {
        alert("Account activated successfully");
      },
      error: () => {
        alert("Activation failed");
        console.log(body);
      }
    });

  }

}