import { Injectable } from '@angular/core';
import {
    Router,
    Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { Ambience } from './ambience';
import { AmbienceService } from './ambience.service';

@Injectable()
export class ProjectAmbienceResolver implements Resolve<Ambience> {
    constructor(
        private ambienceService: AmbienceService,
        private router: Router
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Ambience> {
        let projectTitle = route.params['title'];
        let ambienceTitle = route.params['ambience-title'];

        let ambience = this.ambienceService.getBySlugTitle(ambienceTitle, projectTitle);
        if (!ambience) this.router.navigate(['/projetos']);
        return Promise.resolve(ambience ? ambience : null);
        // return this.ambienceService.getBySlugTitle(ambienceTitle, projectTitle)
        //     .toPromise()
        //     .then()

        // return this.projectService.getProjectBySlugTitle(title)
        //     .toPromise()
        //     .then(project => {
        //         if (project) {
        //             return project
        //         } else {
        //             this.router.navigate(['/projetos']);
        //             return null
        //         }
        //     });
    }
}