import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, UrlTree } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

type Tokens = { accessToken: string; refreshToken: string };

const LEEWAY_SEC = 90; // on rafraîchit quand il reste < 90s

export const AuthGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const http = inject(HttpClient);

  let tokens = getStoredTokens();
  if (!tokens?.accessToken) {
    return router.createUrlTree(['/account/login'], { queryParams: { returnUrl: state.url } });
  }

  // Decode & vérifie expiration avec leeway
  let decoded: any;
  try {
    decoded = jwtDecode(tokens.accessToken);
  } catch {
    return router.createUrlTree(['/account/login'], { queryParams: { returnUrl: state.url } });
  }

  const now = Math.floor(Date.now() / 1000);
  const exp = Number(decoded?.exp ?? 0);

  if (!exp || now + LEEWAY_SEC >= exp) {
    const ok = await tryRefreshingTokens(http, tokens);
    if (!ok) {
      return router.createUrlTree(['/account/login'], { queryParams: { returnUrl: state.url } });
    }
    tokens = getStoredTokens(); // re-charge
    try { decoded = jwtDecode(tokens!.accessToken); } catch {
      return router.createUrlTree(['/account/login'], { queryParams: { returnUrl: state.url } });
    }
  }

  // ── Role-based (ANY-of) ──────────────────────────────────────────────────
  const requiredRoles = route.data?.['roles'] as string[] | undefined;
  if (requiredRoles?.length) {
    const userRoles = getUserRoles(decoded); // string[]
    const allowed = requiredRoles.some(r => userRoles.includes(r));
    if (!allowed) {
      // facultatif: /error?code=unauthorized
      return router.createUrlTree(['/error']);
    }
  }

  return true;
};

// ───────────────────────── Helpers ─────────────────────────
function getStoredTokens(): Tokens | null {
  const accessToken =
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken') ||
    '';
  const refreshToken =
    localStorage.getItem('refreshToken') ||
    sessionStorage.getItem('refreshToken') ||
    '';
  if (!accessToken) return null;
  return { accessToken, refreshToken };
}

function persistTokens(accessToken: string, refreshToken: string) {
  // Choix: on privilégie localStorage s’il y a déjà un token là-bas (remember me),
  // sinon sessionStorage.
  const target =
    localStorage.getItem('accessToken') || localStorage.getItem('refreshToken')
      ? localStorage
      : sessionStorage;

  target.setItem('accessToken', accessToken);
  target.setItem('refreshToken', refreshToken);
}

async function tryRefreshingTokens(http: HttpClient, current: Tokens): Promise<boolean> {
  if (!current.accessToken || !current.refreshToken) return false;

  const baseUrl = environment.ApiBaseUrl?.endsWith('/')
    ? environment.ApiBaseUrl
    : environment.ApiBaseUrl + '/';

  const credentials = {
    AccessToken: current.accessToken,
    RefreshToken: current.refreshToken
  };

  const resp = await firstValueFrom(
    http.post<any>(`${baseUrl}api/token/refresh`, credentials, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true // si ton API utilise des cookies aussi
    }).pipe(
      catchError(err => {
        console.error('Refresh failed', err);
        return of(null);
      })
    )
  );

  if (resp?.accessToken && resp?.refreshToken) {
    persistTokens(resp.accessToken, resp.refreshToken);
    return true;
  }
  return false;
}

/** Retourne les rôles utilisateur, en gérant plusieurs conventions de claims */
function getUserRoles(decoded: any): string[] {
  if (!decoded || typeof decoded !== 'object') return [];

  // 1) ASP.NET classique
  const aspRole = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  if (typeof aspRole === 'string') return [aspRole];

  // 2) role (string) / roles (string[])
  if (typeof decoded.role === 'string') return [decoded.role];
  if (Array.isArray(decoded.roles)) return decoded.roles.filter(Boolean);

  // 3) n’importe quelle clé finissant par "/role"
  const k = Object.keys(decoded).find(x => x.toLowerCase().endsWith('/role'));
  if (k && typeof decoded[k] === 'string') return [decoded[k]];

  // 4) autres conventions utiles (ex: cognito:groups)
  if (Array.isArray(decoded['cognito:groups'])) return decoded['cognito:groups'];

  return [];
}
