import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClimaService } from './../../services/clima';
import { CiudadFavorita } from '../../models/clima.model';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.css',
})
export class BuscadorComponent {
  busqueda = new FormControl('', [Validators.required, Validators.minLength(2)]);
  cargando = signal(false);
  cargandoUbicacion = signal(false);

  constructor(
    private climaService: ClimaService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  get favoritos() {
    return this.climaService.favoritos();
  }

  buscar(): void {
    if (this.busqueda.invalid || !this.busqueda.value) return;
    const ciudad = this.busqueda.value.trim();
    this.router.navigate(['/clima/ciudad', ciudad]);
  }

  usarUbicacion(): void {
    this.cargandoUbicacion.set(true);
    this.climaService
      .obtenerUbicacion()
      .then((position) => {
        const { latitude, longitude } = position.coords;
        this.router.navigate(['/clima/ubicacion', `${latitude},${longitude}`]);
        this.cargandoUbicacion.set(false);
      })
      .catch(() => {
        this.cargandoUbicacion.set(false);
        this.snackBar.open(
          'No se pudo obtener la ubicación. Asegúrate de haber dado permiso.',
          'Cerrar',
          { duration: 5000 },
        );
        this.cargandoUbicacion.set(false);
      });
  }

  irAFavorito(favorito: CiudadFavorita): void {
    this.router.navigate(['/clima/ciudad', favorito.nombre]);
  }

  eliminarFavorito(id: number, event: Event): void {
    event.stopPropagation();
    this.climaService.eliminarFavorito(id);
    this.snackBar.open('Favorito eliminado', 'OK', { duration: 2000 });
  }
}
