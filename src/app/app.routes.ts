import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'clima',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/clima/clima.routes').then(m => m.CLIMA_ROUTES)
  },
  { path: '**', redirectTo: 'auth/login' }
];