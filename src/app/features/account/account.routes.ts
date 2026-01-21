// account.routes.ts
import { Routes } from '@angular/router';

export const ACCOUNT_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
        import('./login/login.component').then((m) => m.LoginComponent),
    },
    {
        path: 'login',
        loadComponent: () =>
        import('./login/login.component').then((m) => m.LoginComponent),
    },
    {
        path: 'register',
        loadComponent: () =>
        import('./register/register.component').then((m) => m.RegisterComponent),
    },
    {
        path: 'register/:guid',
        loadComponent: () =>
        import('./register/register.component').then((m) => m.RegisterComponent),
    },
        {
        path: 'activate/:id',
        loadComponent: () =>
        import('../user/pages/activate/activate.component').then(m => m.ActivateComponent),
    },
    {
        path: 'forgot-password',
        loadComponent: () =>
        import('./forgot-password/forgot-password.component').then(
            (m) => m.ForgotPasswordComponent
        ),
    },
    {
        path: 'reset-password/:id',
        loadComponent: () =>
        import('./reset-password/reset-password.component').then(
            (m) => m.ResetPasswordComponent
        ),
    },
    {
        path: 'zwift-linked',
        loadComponent: () =>
        import('./zwift-linked/zwift-linked').then(m => m.ZwiftLinked),
    },
    // {
    //     path: 'restricted/:country',
    //     loadComponent: () =>
    //     import('./restricted/restricted.component').then((m) => m.RestrictedComponent),
    // },
];
