import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import {
  SOCIAL_AUTH_CONFIG,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider
} from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([loadingInterceptor, authInterceptor])),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-bottom-left',
      preventDuplicates: true,
    }),
    {
      provide: SOCIAL_AUTH_CONFIG,
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '834491397839-rci98mdsfvnl10mdgbfl1elm7ui94hcm.apps.googleusercontent.com',
              { oneTapEnabled: false, prompt: 'select_account' }
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('VOTRE_APP_ID_FACEBOOK_ICI')
          }
        ],
        onError: (err) => console.error('SocialAuth Error:', err)
      } as SocialAuthServiceConfig,
    }
  ]
};
