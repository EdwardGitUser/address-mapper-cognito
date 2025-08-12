import { HttpInterceptorFn } from '@angular/common/http';
import { fetchAuthSession } from 'aws-amplify/auth';
import { from } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const isRelative: boolean = !/^https?:\/\//i.test(req.url);
    if (!isRelative || req.headers.has('Authorization')) return next(req);

    return from(fetchAuthSession()).pipe(
        switchMap(session => {
            const token = session.tokens?.accessToken?.toString();
            return next(
                token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req
            );
        }),
        catchError(() => next(req))
    );
};
