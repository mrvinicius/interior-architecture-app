import { Injectable } from '@angular/core';
import {
    Router,
    Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/first';

import { ProjectsService } from './projects.service';
import { Project } from './project';
import { Proposal } from './proposal';

@Injectable()
export class ProjectProposalPreviewResolver implements Resolve<Project> {
    constructor(
        private projectsService: ProjectsService,
        private router: Router
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Project> {
        let id = route.params['id'];
        console.log(id);
        
        return this.projectsService.getOneById(id, true).map(project => {            
            return project;
        }).first();
    }
}
