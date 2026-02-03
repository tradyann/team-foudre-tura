// user.routes.ts

import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth-guard.service';

export const USER_ROUTES: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        loadComponent: () =>
        import('./profile/profile').then(m => m.Profile),
    },
    {
        path: 'file-upload',
        canActivate: [AuthGuard],
        loadComponent: () =>
        import('./pages/file-upload/file-upload').then(m => m.FileUpload),
    },
    {
        path: 'ledger-history',
        canActivate: [AuthGuard],
        loadComponent: () =>
        import('./pages/ledger-history/ledger-history').then(m => m.LedgerHistory),
    },
    {
        path: 'ledger-team',
        canActivate: [AuthGuard],
        loadComponent: () =>
        import('./pages/ledger-team/ledger-team').then(m => m.LedgerTeam),
    },
    {
        path: 'team',
        canActivate: [AuthGuard],
        loadComponent: () =>
        import('./pages/team/team').then(m => m.Team),
    },
    // {
    //     path: 'help-center',
    //     loadComponent: () =>
    //     import('./pages/help-center/help-center.component').then(m => m.HelpCenterComponent),
    // },
    // {
    //     path: 'change-password',
    //     canActivate: [AuthGuard],
    //     loadComponent: () =>
    //     import('./pages/change-password/change-password.component').then(m => m.ChangePasswordComponent),
    // },
    // {
    //     path: 'two-factor',
    //     canActivate: [AuthGuard],
    //     loadComponent: () =>
    //     import('./pages/two-factor/two-factor.component').then(m => m.TwoFactorComponent),
    // },
    // {
    //     path: 'information/:id',
    //     loadComponent: () =>
    //     import('./pages/information/information.component').then(m => m.InformationComponent),
    // },
];
