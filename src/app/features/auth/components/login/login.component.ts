import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  formulario: FormGroup;
  cargando = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      username: ['mor_2314', Validators.required],
      password: ['83r5^_', Validators.required]
    });
  }

  get usernameControl() { return this.formulario.get('username'); }
  get passwordControl() { return this.formulario.get('password'); }

  login(): void {
    if (this.formulario.invalid) return;
    this.cargando = true;
    this.error = null;

    this.authService.login(this.formulario.value)
      .subscribe({
        next: () => {
          this.cargando = false;
          this.router.navigate(['/clima']);
        },
        error: () => {
          this.cargando = false;
          this.error = 'Usuario o contraseña incorrectos';
        }
      });
  }
}