import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Blocked } from './features/blocked/blocked';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { Compet } from './features/compet/compet';

export const routes: Routes = [
    {
        path: '',
        //canActivate: [AuthDevGuard],
        component: MainLayout,
        children: [
            {   path: '', component: Home, data: { title: 'Dashboard' } },
            // {   path: 'welcome', component: Welcome, data: { title: 'Welcome' } },
            // {   path: 'overview', component: Welcome, data: { title: 'Overview' } },
            // {   path: 'api-console', canActivate: [AuthGuard], component: ApiConsole, data: { title: 'API Console' } },
            {   path: 'zw', loadChildren: () => import('./features/zwift/zwift.routes').then(m => m.ZWIFT_ROUTES) },
            {   path: 'not-found', loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound) },
            // {   path: 'user', canActivate: [AuthGuard], loadChildren: () => import('./features/user/user.routes').then(m => m.USER_ROUTES) },
            // {   path: 'manager', canActivate: [AuthGuard], loadChildren: () => import('./features/manager/manager.routes').then(m => m.MANAGER_ROUTES) },
            {   path: 'game', loadChildren: () => import('./features/gaming/gaming.routes').then(m => m.GAMING_ROUTES) },
            // {   path: 'search-result/:query', canActivate: [AuthGuard], component: SearchResult }
        ],
    },
    // { 
    //     path: '',
    //     //canActivate: [AuthDevGuard],
    //     component: AccountLayoutComponent, // AccountLayoutComponent
    //     children: [
    //         { path: 'account', loadChildren: () => import('./features/account/account.routes').then(m => m.ACCOUNT_ROUTES) },
    //     ]
    // },
    // {
    //     path: ':lang',
    //     component: MainLayout,
    //     canActivate: [LangGuard],
    //     children: [
    //         { path: '', component: Home },
    //         { path: 'not-found', component: NotFound },
    //         { path: '**', redirectTo: 'not-found' },
    //     ],
    // },
    {
        path: '',
        component: BlankLayoutComponent,
        children: [
            { path: 'blocked', component: Blocked },
            { path: 'compet', component: Compet },
        ]
    },
    { path: '**', redirectTo: 'not-found' }
];
