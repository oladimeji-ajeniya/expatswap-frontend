import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { ExpatswapLoadingService } from '@expatswap/services/loading/loading.service';
import { finalize, Observable, take } from 'rxjs';

export const expatswapLoadingInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> =>
{
    const expatswapLoadingService = inject(ExpatswapLoadingService);
    let handleRequestsAutomatically = false;

    expatswapLoadingService.auto$
        .pipe(take(1))
        .subscribe((value) =>
        {
            handleRequestsAutomatically = value;
        });

    // If the Auto mode is turned off, do nothing
    if ( !handleRequestsAutomatically )
    {
        return next(req);
    }

    // Set the loading status to true
    expatswapLoadingService._setLoadingStatus(true, req.url);

    return next(req).pipe(
        finalize(() =>
        {
            // Set the status to false if there are any errors or the request is completed
            expatswapLoadingService._setLoadingStatus(false, req.url);
        }));
};
