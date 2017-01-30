import { NgModule } from '@angular/core';
import { NoPreloading, PreloadAllModules, RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  // { path: 'projetos', redirectTo: '/projetos', pathMatch: 'full' }
  { path: '', loadChildren: './internal/internal.module#InternalModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: NoPreloading })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
