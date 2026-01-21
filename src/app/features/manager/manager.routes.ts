
import { Routes } from '@angular/router';
import { CompetitionRoutes } from './competition-routes/competition-routes';
import { MenuManager } from './menu-manager/menu-manager';
import { ApiDoc } from './api-doc/api-doc';

export const MANAGER_ROUTES: Routes = [
    { path: '',  component: MenuManager, data: { title: 'Manager' } },
    { path: 'api-doc',  component: ApiDoc, data: { title: 'API' } },
    {
        path: 'upload-files',
        loadComponent: () =>
        import('./upload-files/upload-files').then(m => m.UploadFiles)
    },
    { path: 'competition-routes/:competitionId', component: CompetitionRoutes, data: { title: 'Routes' } },
];
