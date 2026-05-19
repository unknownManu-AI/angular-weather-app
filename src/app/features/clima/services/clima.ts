import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ClimaActual, Pronostico, CiudadFavorita } from '../models/clima.model';

@Injectable({ providedIn: 'root' })
export class ClimaService {
  private apiUrl = environment.apiUrl;
  private apiKey = environment.apiKey;
  private unidades = 'metric';  // celsius
  private lang = 'es';          // español

  // Favoritos con signal + localStorage
  favoritos = signal<CiudadFavorita[]>(
    JSON.parse(localStorage.getItem('favoritos') || '[]')
  );

  constructor(private http: HttpClient) {}

  getClimaPorCiudad(ciudad: string): Observable<ClimaActual> {
    return this.http.get<ClimaActual>(`${this.apiUrl}/weather`, {
      params: {
        q: ciudad,
        appid: this.apiKey,
        units: this.unidades,
        lang: this.lang
      }
    });
  }

  getClimaPorCoordenadas(lat: number, lon: number): Observable<ClimaActual> {
    return this.http.get<ClimaActual>(`${this.apiUrl}/weather`, {
      params: {
        lat: lat.toString(),
        lon: lon.toString(),
        appid: this.apiKey,
        units: this.unidades,
        lang: this.lang
      }
    });
  }

  getPronostico(ciudad: string): Observable<Pronostico> {
    return this.http.get<Pronostico>(`${this.apiUrl}/forecast`, {
      params: {
        q: ciudad,
        appid: this.apiKey,
        units: this.unidades,
        lang: this.lang,
        cnt: '40'
      }
    });
  }

  getPronosticoPorCoordenadas(lat: number, lon: number): Observable<Pronostico> {
    return this.http.get<Pronostico>(`${this.apiUrl}/forecast`, {
      params: {
        lat: lat.toString(),
        lon: lon.toString(),
        appid: this.apiKey,
        units: this.unidades,
        lang: this.lang,
        cnt: '40'
      }
    });
  }

  // Favoritos
  agregarFavorito(ciudad: ClimaActual): void {
    const yaExiste = this.favoritos().some(f => f.id === ciudad.id);
    if (yaExiste) return;

    const nuevo: CiudadFavorita = {
      id: ciudad.id,
      nombre: ciudad.name,
      pais: ciudad.sys.country,
      agregadaEn: new Date()
    };

    this.favoritos.update(favs => [...favs, nuevo]);
    localStorage.setItem('favoritos', JSON.stringify(this.favoritos()));
  }

  eliminarFavorito(id: number): void {
    this.favoritos.update(favs => favs.filter(f => f.id !== id));
    localStorage.setItem('favoritos', JSON.stringify(this.favoritos()));
  }

  esFavorito(id: number): boolean {
    return this.favoritos().some(f => f.id === id);
  }

  // Geolocalización del navegador
  obtenerUbicacion(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocalización no soportada');
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }
}