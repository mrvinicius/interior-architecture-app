import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/toPromise';

import { Ambience } from './ambience';

@Injectable()
export class AmbienceService {

  constructor() { }

  add(projectId?: string): Observable<Ambience> {
    let data: any = {}

    if (projectId !== undefined) data.ProjetoID = projectId

    let ambience = new Ambience();
    ambience.services = [];

    return Observable.of(ambience);
  }

  getOne(id: string): Observable<Ambience> {
    let ambience = new Ambience();
    ambience.services = [];

    return Observable.of(ambience); // TODO: Mock data / Api
  }
}
