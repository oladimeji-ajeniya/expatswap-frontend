import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { LayoutComponent } from 'app/layout/layout.component';


export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    {path: '', pathMatch : 'full', redirectTo: 'add-user'},
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'add-user'},
    {
        path: '',
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'add-user', loadChildren: () => import('app/modules/add-user/add-user.routes')},
            {path: 'list-user', loadChildren: () => import('app/modules/list-user/list-user.routes')},
        ]
    },
    {path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/error/error-404/error-404.routes')},
    {path: '**', redirectTo: '404-not-found'}
];
