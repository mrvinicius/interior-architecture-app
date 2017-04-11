import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Client } from '../../client/shared/client';
import { Project } from './project';
import { PROJECTS } from './mock-projects';

import { StringHelperService } from '../../../core/string-helper.service';

@Injectable()
export class ProjectsService {
  http: Http;
  headers: Headers;

  constructor(
    private stringHelper: StringHelperService
  ) { }

  addProject(title: string): number {
    PROJECTS.push({
      id: 99,
      title: title,
      client: new Client()
    });

    return 99;
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
    title = this.stringHelper.replaceSpecialChars(title);

    let projects = PROJECTS.filter(
      project => this.stringHelper.replaceSpecialChars(project.title).toLowerCase().indexOf(title.toLowerCase()) > -1
    );

    return Promise.resolve(projects);
  }

  updateProject(project: Project): void {
    
  }
}
