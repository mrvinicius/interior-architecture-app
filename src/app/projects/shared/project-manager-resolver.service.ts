import { Injectable } from '@angular/core';
import {
    Router,
    Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { Project } from './project';
import { ProjectsService } from './projects.service';

@Injectable()
export class ProjectManagerResolver implements Resolve<Project> {
    constructor(
        private projectService: ProjectsService,
        private router: Router
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Project> {
        let title = route.params['title'];
        
        let project = this.projectService.getOneBySlugTitle(title);
        if (!project) this.router.navigate(['/projetos']);
        return Promise.resolve(project ? project : null);

            // .toPromise()
            // .then(project => {
            //     if (project) {
            //         return project
            //     } else {
            //         this.router.navigate(['/projetos']);
            //         return null
            //     }
            // });
    }
}