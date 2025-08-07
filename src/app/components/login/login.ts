import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, AuthResponse } from '../../services/auth';
import { Router } from '@angular/router';
import { ErrorComponent } from '../error/error';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ErrorComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  fieldErrors: { [key: string]: string[] } = {
    email: [],
    password: []
  };
  generalErrors: string[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  clearErrors() {
    this.fieldErrors = {
      email: [],
      password: []
    };
    this.generalErrors = [];
  }

  onSubmit() {
    this.clearErrors();
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const errors = err.error?.errors;
        if (Array.isArray(errors)) {
          errors.forEach((e: any) => {
            if (e.field && this.fieldErrors[e.field] !== undefined) {
              this.fieldErrors[e.field].push(e.message);
            } else {
              this.generalErrors.push(e.message);
            }
          });
        } else if (err.error?.message) {
          this.generalErrors.push(err.error.message);
        } else {
          this.generalErrors.push('Error al iniciar sesión');
        }
      },
    });
  }
}
