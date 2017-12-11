import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

export const appRoutes: Routes = [
    { path: '', redirectTo: 'customers', pathMatch: 'full' },
    { path: 'app', component: AppComponent },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);