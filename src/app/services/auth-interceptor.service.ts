import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, from, lastValueFrom } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    const theEndpoint = `${environment.shopKartApiUrl}/orders`;
    const securedEndpoints = [theEndpoint];

    const isSecured = securedEndpoints.some(url => request.urlWithParams.startsWith(url));

    if (isSecured) {
      try {
        const token = await this.auth.getAccessTokenSilently().toPromise();  // ✅ Use toPromise()
        if (token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
        }
      } catch (err) {
        console.error('Error getting token', err);
      }
    }

    return await lastValueFrom(next.handle(request));
  }
}
