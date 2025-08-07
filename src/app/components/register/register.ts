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
  errors: string[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.register(this.email, this.password, this.fullName).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errors = err.error?.errors?.map((e: any) => e.message) || [err.error?.message || 'Error al registrarse'];
      },
    });
  }
}
