import { Injectable } from '@angular/core';
import { RequestOptions, Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/toPromise';

import { ServiceType } from './service-type';
import { UtilsService } from './../../shared/utils/utils.service';

@Injectable()
export class ProjectServicesService {
  public readonly serviceTypes: ServiceType[] = [];
  private readonly typeBaseUrl = 'http://52.67.21.201/muuving/api/tipoServico';
  // private readonly servicesBaseUrl = 'http://52.67.21.201/muuving/api/tipo+de+serviço'

  constructor(
    private http: Http
  ) {
    this.getAllServiceTypes().subscribe((types: ServiceType[]) => {      
      types.forEach(type => {        
        this.serviceTypes.push(type);
      });
    });
  }

  getAllServiceTypes(): Observable<ServiceType[]> {
    let options = new RequestOptions({ headers: this.getHeaders() });

    return this.http.get(this.typeBaseUrl + '/getall', options)
      .map((response: Response) => {
        let body = JSON.parse(response.text());

        return body.map(type => {
          
          return new ServiceType(type.Id, type.Tipo, type.DescricaoPadrao);
        })
      })
      .catch(this.handleError);
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
