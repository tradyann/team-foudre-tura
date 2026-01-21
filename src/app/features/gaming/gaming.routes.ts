import { Routes } from '@angular/router';
import { Calendar } from './calendar/calendar';
import { HelpCenter } from './help-center/help-center';
import { Rules } from './rules/rules';
import { Competition } from './competition/competition';
import { TeamDetails } from './team-details/team-details';
import { RiderDetails } from './rider-details/rider-details';
import { OverallRanking } from './overall-ranking/overall-ranking';
import { Roadbook } from './roadbook/roadbook';
import { AuthGuard } from '../../core/guards/auth-guard.service';
import { JerseyStructure } from './jersey-structure/jersey-structure';
import { Categorization } from './categorization/categorization';

export const GAMING_ROUTES: Routes = [
    { path: 'ranking', component: OverallRanking, data: { title: 'Ranking' } },
    {
        path: 'riders',
        canActivate: [AuthGuard],
        loadComponent: () =>
        import('./riders/list-riders/list-riders').then(m => m.ListRiders), data: { title: 'Riders' },
    },
    {
        path: 'teams',
        loadComponent: () =>
        import('./teams/list-teams/list-teams').then(m => m.ListTeams), data: { title: 'Teams' },
    },
    { path: 'rider-details/:riderId', canActivate: [AuthGuard], component: RiderDetails, data: { title: 'Rider' }},
    { path: 'team-details/:teamId', canActivate: [AuthGuard], component: TeamDetails, data: { title: 'Team' }},
    { path: 'categorization', component: Categorization, data: { title: 'Categorization' } },
    { path: 'calendar', component: Calendar, data: { title: 'Calendar' } },
    { path: 'rules', component: Rules, data: { title: 'Rules' } },
    { path: 'help-center', canActivate: [AuthGuard], component: HelpCenter, data: { title: 'Support' } },
    { path: 'competition/:competitionId', component: Competition, data: { title: 'Competition' } },
    { path: 'roadbook/:roadbookId', component: Roadbook, data: { title: 'Roadbook' } },
    { path: 'jersey-structure', component: JerseyStructure, data: { title: 'Jersey & Bonus' } },
];
