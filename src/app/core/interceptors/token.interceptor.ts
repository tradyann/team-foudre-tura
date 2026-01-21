import { HttpInterceptorFn } from '@angular/common/http';

export const myInterceptor: HttpInterceptorFn = (req, next) => {
  // Retrieve the access token from localStorage
  const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

  // Clone the request and add the Authorization header if the token exists
  const modifiedReq = accessToken
    ? req.clone({
        setHeaders: {
          Authorization: `bearer ${accessToken}`,
        },
      })
    : req;

  // Pass the modified request to the next handler
  return next(modifiedReq);
};