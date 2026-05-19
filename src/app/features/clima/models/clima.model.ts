export interface ClimaActual {
  id: number;
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  dt: number;
}

export interface PronosticoDia {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  dt_txt: string;
}

export interface Pronostico {
  list: PronosticoDia[];
  city: {
    name: string;
    country: string;
  };
}

export interface CiudadFavorita {
  id: number;
  nombre: string;
  pais: string;
  agregadaEn: Date;
}