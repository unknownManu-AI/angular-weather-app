import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../features/auth/services/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('token');

  if (token) {
    const requestUrl = new URL(req.url, window.location.origin);
    const sameOrigin = requestUrl.origin === window.location.origin;

    if (sameOrigin) {
      const reqConToken = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next(reqConToken);
    }
  }

  return next(req);
};
