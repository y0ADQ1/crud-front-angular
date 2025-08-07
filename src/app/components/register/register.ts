import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { ErrorComponent } from '../error/error';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ErrorComponent],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  password_confirmation: string = '';
  fullName: string | null = null;

  fieldErrors: { [key: string]: string[] } = {
    fullName: [],
    email: [],
    password: [],
    password_confirmation: []
  };
  generalErrors: string[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  clearErrors() {
    this.fieldErrors = {
      fullName: [],
      email: [],
      password: [],
      password_confirmation: []
    };
    this.generalErrors = [];
  }

  onSubmit() {
    this.clearErrors();
    this.authService.register(this.email, this.password, this.fullName).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // Suponiendo que el backend retorna errores en formato: { field: string, message: string }
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
          this.generalErrors.push('Error al registrarse');
        }
      },
    });
  }
}
