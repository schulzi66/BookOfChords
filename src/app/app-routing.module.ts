import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ChordEditComponent } from './chord/chord-edit/chord-edit.component';
import { ChordOverviewComponent } from './chord/chord-overview/chord-overview.component';
const routes: Routes = [
    {
        path: '',
        redirectTo: 'songs',
        pathMatch: 'full'
    },
    {
        path: 'songs',
        component: ChordOverviewComponent
    },
    {
        path: 'edit-song',
        component: ChordEditComponent
    },
    {
        path: 'gigs',
        loadChildren: './gig/gig.module#GigModule'
    },
    {
        path: 'configuration',
        loadChildren: './configuration/configuration.module#ConfigurationModule'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
