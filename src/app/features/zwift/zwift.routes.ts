// zwift.routes.ts

import { Routes } from '@angular/router';

export const ZWIFT_ROUTES: Routes = [
    {
        path: 'stage-results/:competitionId/:category/:stageNumber',
        loadComponent: () =>
        import('./results/stage-results/stage-results').then(m => m.StageResults)
    },
    {
        path: 'stage-points/:competitionId/:category/:jerseyId/:stageNumber',
        loadComponent: () =>
        import('./results/stage-points/stage-points').then(m => m.StagePoints)
    },
    {
        path: 'competition-results/:competitionId/:category/:stageNumber',
        loadComponent: () =>
        import('./results/competition-results/competition-results').then(m => m.CompetitionResults)
    },
    {
        path: 'competition-points/:competitionId/:category/:jerseyId/:stageNumber',
        loadComponent: () =>
        import('./results/competition-points/competition-points').then(m => m.CompetitionPoints)
    }
];
