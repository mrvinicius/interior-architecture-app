import { NgModule } from '@angular/core';
import { NoPreloading, PreloadAllModules, RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  // { path: 'projetos', loadChildren: './projects/projects.module#ProjectsModule' },
  // { path: '', loadChildren: './internal/internal.module#InternalModule' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
