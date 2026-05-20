import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { ClimaService } from '../../services/clima';
import { ClimaActual, Pronostico } from '../../models/clima.model';

@Component({
  selector: 'app-clima-actual',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  templateUrl: './clima-actual.component.html',
  styleUrl: './clima-actual.component.css',
})
export class ClimaActualComponent implements OnInit {
  clima = signal<ClimaActual | null>(null);
  pronostico = signal<Pronostico | null>(null);
  cargando = signal(true);
  error = signal<string | null>(null);

  esFavorito = computed(() =>
    this.clima() ? this.climaService.esFavorito(this.clima()!.id) : false,
  );

  // Pronóstico filtrado — un resultado por día
  pronosticoDias = computed(() => {
    if (!this.pronostico()) return [];
    const vistos = new Set<string>();
    return this.pronostico()!
      .list.filter((item) => {
        const dia = item.dt_txt.split(' ')[0];
        if (vistos.has(dia)) return false;
        vistos.add(dia);
        return true;
      })
      .slice(0, 5);
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private climaService: ClimaService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    const nombre = this.route.snapshot.paramMap.get('nombre') || '';

    // Detectar si son coordenadas (lat,lon)
    const esCoordenadas = nombre.includes(',');

    if (esCoordenadas) {
      const [lat, lon] = nombre.split(',').map(Number);
      this.cargarPorCoordenadas(lat, lon);
    } else {
      this.cargarPorCiudad(nombre);
    }
  }

  cargarPorCiudad(ciudad: string): void {
    this.climaService.getClimaPorCiudad(ciudad).subscribe({
      next: (clima) => {
        this.clima.set(clima);
        this.climaService.getPronostico(ciudad).subscribe({
          next: (p) => this.pronostico.set(p),
        });
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Ciudad no encontrada');
        this.cargando.set(false);
      },
    });
  }

  cargarPorCoordenadas(lat: number, lon: number): void {
    this.climaService.getClimaPorCoordenadas(lat, lon).subscribe({
      next: (clima) => {
        this.clima.set(clima);
        this.climaService.getPronosticoPorCoordenadas(lat, lon).subscribe({
          next: (p) => this.pronostico.set(p),
        });
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo obtener el clima de tu ubicación');
        this.cargando.set(false);
      },
    });
  }

  toggleFavorito(): void {
    if (!this.clima()) return;

    if (this.esFavorito()) {
      this.climaService.eliminarFavorito(this.clima()!.id);
      this.snackBar.open('Eliminado de favoritos', 'OK', { duration: 2000 });
    } else {
      this.climaService.agregarFavorito(this.clima()!);
      this.snackBar.open('Agregado a favoritos ⭐', 'OK', { duration: 2000 });
    }
  }

  volver(): void {
    this.router.navigate(['/clima']);
  }

  getIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }

  getDiaSemana(dt: number): string {
    return new Date(dt * 1000).toLocaleDateString('es-ES', { weekday: 'long' });
  }
}
