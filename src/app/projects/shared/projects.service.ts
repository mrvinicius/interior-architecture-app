import { Injectable } from '@angular/core';

import { Project } from './project';
import { PROJECTS } from './mock-projects';

import { StringHelperService } from '../../core/string-helper.service';


@Injectable()
export class ProjectsService {

  constructor(
    private stringHelper: StringHelperService
  ) { }

  getAll(): Promise<Project[]> {
    let projects: Project[] = PROJECTS;

    return Promise.resolve(projects);
  }

  getProject(id: number): Promise<Project> {
    let project: Promise<Project>;

    project = this.getAll().then(
      projects => projects.find(
        project => project.id === id
      )
    );

    return Promise.resolve(project);
  }

  // search(title: string): Promise<Project[]> {
  //   title = this.stringHelper.replaceSpecialChars(name);

  //   let projects = PROJECTS.filter(
  //     project => this.stringHelper.replaceSpecialChars(project.title).toLowerCase().indexOf(title.toLowerCase()) > -1
  //   );

  //   return Promise.resolve(projects);
  // }

  search(title: string): Promise<Project[]> {
    title = this.stringHelper.replaceSpecialChars(title);

    let projects = PROJECTS.filter(
      project => this.stringHelper.replaceSpecialChars(project.title).toLowerCase().indexOf(title.toLowerCase()) > -1
    );

    return Promise.resolve(projects);
  }

}
