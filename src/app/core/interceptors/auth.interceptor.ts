import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';

export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiOTVhY2JhZi00MWJhLTQwZmEtOTUwZC05M2ZmMzI0ZDZiMGQiLCJlbWFpbCI6ImxhbGFtb2hhbW1lZDc4OUBnbWFpbC5jb20iLCJSb2xlIjoiQWRtaW4iLCJleHAiOjE3NzM3NjY3MDEsImlzcyI6IlVzZXJTZXJ2aWNlIiwiYXVkIjoiVXNlclNlcnZpY2VDbGllbnQifQ.5zmitbwZ51kAxGNXUYa9JXEpX3AU8LZZ33h7S5pI8i8';

  // 1. Skip if the request has the SKIP_AUTH metadata
  // 2. Skip if it's not a request to your API gateway (localhost:5000)
  const isApiUrl = req.url.startsWith('http://localhost:5000');
  
  if (req.context.get(SKIP_AUTH) || !isApiUrl) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
