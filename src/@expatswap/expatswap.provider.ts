import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ENVIRONMENT_INITIALIZER, EnvironmentProviders, importProvidersFrom, inject, Provider } from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { EXPATSWAP_MOCK_API_DEFAULT_DELAY, mockApiInterceptor } from '@expatswap/lib/mock-api';
import { ExpatswapConfig } from '@expatswap/services/config';
import { EXPATSWAP_CONFIG } from '@expatswap/services/config/config.constants';
import { ExpatswapConfirmationService } from '@expatswap/services/confirmation';
import { expatswapLoadingInterceptor, ExpatswapLoadingService } from '@expatswap/services/loading';
import { ExpatswapMediaWatcherService } from '@expatswap/services/media-watcher';
import { ExpatswapPlatformService } from '@expatswap/services/platform';
import { ExpatswapSplashScreenService } from '@expatswap/services/splash-screen';
import { ExpatswapUtilsService } from '@expatswap/services/utils';

export type ExpatswapProviderConfig = {
    mockApi?: {
        delay?: number;
        services?: any[];
    },
    expatswap?: ExpatswapConfig
}

/**
 * Expatswap provider
 */
export const provideExpatswap = (config: ExpatswapProviderConfig): Array<Provider | EnvironmentProviders> =>
{
    // Base providers
    const providers: Array<Provider | EnvironmentProviders> = [
        {
            // Disable 'theme' sanity check
            provide : MATERIAL_SANITY_CHECKS,
            useValue: {
                doctype: true,
                theme  : false,
                version: true,
            },
        },
        {
            // Use the 'fill' appearance on Angular Material form fields by default
            provide : MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                appearance: 'fill',
            },
        },
        {
            provide : EXPATSWAP_MOCK_API_DEFAULT_DELAY,
            useValue: config?.mockApi?.delay ?? 0,
        },
        {
            provide : EXPATSWAP_CONFIG,
            useValue: config?.expatswap ?? {},
        },

        importProvidersFrom(MatDialogModule),
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(ExpatswapConfirmationService),
            multi   : true,
        },

        provideHttpClient(withInterceptors([expatswapLoadingInterceptor])),
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(ExpatswapLoadingService),
            multi   : true,
        },

        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(ExpatswapMediaWatcherService),
            multi   : true,
        },
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(ExpatswapPlatformService),
            multi   : true,
        },
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(ExpatswapSplashScreenService),
            multi   : true,
        },
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(ExpatswapUtilsService),
            multi   : true,
        },
    ];

    // Mock Api services
    if ( config?.mockApi?.services )
    {
        providers.push(
            provideHttpClient(withInterceptors([mockApiInterceptor])),
            {
                provide   : APP_INITIALIZER,
                deps      : [...config.mockApi.services],
                useFactory: () => (): any => null,
                multi     : true,
            },
        );
    }

    // Return the providers
    return providers;
};
