import { NgModule } from '@angular/core';
import { NoPreloading, PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  // { path: 'projetos', loadChildren: './projects/projects.module#ProjectsModule' },
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: '**', redirectTo: 'home' }
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
