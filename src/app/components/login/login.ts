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
  errors: string[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errors = err.error?.errors?.map((e: any) => e.message) || [err.error?.message || 'Error al iniciar sesión'];
      },
    });
  }
}
