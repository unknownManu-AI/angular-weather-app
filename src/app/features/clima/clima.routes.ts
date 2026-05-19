import { Routes } from '@angular/router';

export const CLIMA_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/buscador/buscador.component')
        .then(m => m.BuscadorComponent)
  },
  {
    path: 'ciudad/:nombre',
    loadComponent: () =>
      import('./components/clima-actual/clima-actual.component')
        .then(m => m.ClimaActualComponent)
  },
  {
    path: 'favoritos',
    loadComponent: () =>
      import('./components/favoritos/favoritos.component')
        .then(m => m.FavoritosComponent)
  }
];