import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/toPromise';

import { Ambience } from './ambience';
import { Project } from './project';
import { ProjectsService } from './projects.service';
import { AmbienceDescription } from './ambience-description.enum';
import { ServicesGroup } from './services-group.enum';

@Injectable()
export class AmbienceService {
  private static readonly baseUrl = 'http://52.67.21.201/muuving/api/comodo';
  
  constructor(
    private projectsService: ProjectsService,
    private http: Http
  ) {
  }

  public static parse(ambienceJSON): Ambience {
    let ambience: Ambience

    return ambience
  }
  // add(ambience: Ambience): Observable<Ambience> {
  //   let options = new RequestOptions({ headers: this.getHeaders() });
  //   let data: any = {
  //     Descricao: AmbienceDescription[ambience.ambienceDescription],
  //   };

  //   return this.http
  //     .put(AmbienceService.baseUrl + '/add', data, options)
  //     .map((response: Response) => {
  //       let body = JSON.parse(response.text());
  //       return new Ambience(body.Id,
  //         AmbienceDescription[AmbienceDescription[body.Descricao]]);

  //     })
  //     .catch(this.handleError);


  // }

  // getBySlugTitle(titleOrId: string, projectSlugTitle?: string): Ambience {
  //   if (projectSlugTitle !== undefined) {
  //     // this.projectsService.getOne(projectId).map .subscribe(project => {
  //     //   return ambience = project.ambiences.find(ambience => { return ambience.title === titleOrId });
  //     // });
  //     let p: Project = this.projectsService.getOneBySlugTitle(projectSlugTitle);
  //     return p.ambiences.find(ambience => { return ambience.description === titleOrId });


  //     // this.projectsService.getOneBySlugTitle(projectSlugTitle).subscribe(project => {
  //     //   return project.ambiences.find(ambience => { return ambience.title === titleOrId });
  //     // })


  //   } else {
  //     console.error('Apenas buscas de ambientes por nome de projeto');
  //   }
  // }

  // getOne(id: string): Observable<Ambience> {
  //   let ambience: Ambience;
  //   ambience.services = [];

  //   return Observable.of(ambience); // TODO: Mock data / Api
  // }

  getAmbienceServicesGroup(ambience: Ambience): ServicesGroup {
    let servicesGroup: ServicesGroup;

    servicesGroup = ServicesGroup.Low;
    servicesGroup = ServicesGroup.Medium;
    servicesGroup = ServicesGroup.High;
    return servicesGroup;
  }

  private getHeaders() {
    let headers = new Headers();

    headers.append('Authorization', 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==');
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');

    return headers;
  }

  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
