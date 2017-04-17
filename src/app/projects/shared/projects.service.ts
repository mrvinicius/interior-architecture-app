import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

import { Client } from './../../client/shared/client';
import { projects } from './mock-projects';
import { Project } from './project';
import { UtilsService } from './../../shared/utils/utils.service';

@Injectable()
export class ProjectsService {

  constructor() { }

  addProject(title: string): number {
    projects.push({
      id: 99,
      title: title,
      client: new Client()
    });

    return 99;
  }

  getAll(): Observable<Project[]> {
    return Observable.of(projects);
  }

  // getAll(): Promise<Project[]> {
  //   this.headers = new Headers();
  //   this.headers.append("Content-Type", 'application/json');
  //   this.headers.append("Authorization", "Basic YTpi");

  //   let result = this.http.get('http://52.67.21.201/muuving/api/profissao/getall', {headers: this.headers})
  //   .map(res => res.json().data);

  //   // let projects: Project[] = PROJECTS;
  //   // return Promise.resolve(result);
  //   // return Promise.resolve(projects);
  // }

  // getProject(id: number): Promise<Project> {
  //   let project: Promise<Project>;

  //   project = this.getAll().then(
  //     projects => projects.find(
  //       project => project.id === id
  //     )
  //   );

  //   return Promise.resolve(project);
  // }

  search(title: string): Promise<Project[]> {
    title = UtilsService.replaceSpecialChars(title);

    let projectList = projects.filter(
      project => UtilsService.replaceSpecialChars(project.title).toLowerCase().indexOf(title.toLowerCase()) > -1
    );

    return Promise.resolve(projects);
  }

  updateProject(project: Project): void {

  }

}
