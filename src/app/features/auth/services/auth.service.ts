import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginRequest, LoginResponse, Usuario } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.authUrl;
  private tokenKey = 'token';
  private usuarioKey = 'usuario';

  // Estado de autenticación con signals
  private _token = signal<string | null>(localStorage.getItem(this.tokenKey));
  private _usuario = signal<Usuario | null>(
    JSON.parse(localStorage.getItem(this.usuarioKey) || 'null'),
  );

  // Computed públicos — solo lectura
  isAuthenticated = computed(() => !!this._token());
  usuario = computed(() => this._usuario());
  token = computed(() => this._token());

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(credenciales: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, credenciales).pipe(
      tap((response) => {
        // Guardar token y usuario
        this._token.set(response.token);
        this._usuario.set({ username: credenciales.username });
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.usuarioKey, JSON.stringify({ username: credenciales.username }));
      }),
    );
  }

  logout(): void {
    this._token.set(null);
    this._usuario.set(null);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usuarioKey);
    this.router.navigate(['/auth/login']);
  }
}
