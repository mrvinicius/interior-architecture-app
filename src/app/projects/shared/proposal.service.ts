import { Project } from './project';
import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ClientService } from './../../client/shared/client.service';
import { ProfessionalService } from './../../core/professional.service';
import { AuthService } from './../../core/auth.service';

@Injectable()
export class ProposalService {
  private readonly baseUrl = 'http://52.67.21.201/muuving/api/proposta';

  constructor(
    private auth: AuthService,
    private http: Http,
    private profService: ProfessionalService,
    private clientService: ClientService
  ) { }

  send(project: Project): Observable<boolean> {
    let options = new RequestOptions({ headers: this.getHeaders() });
    let data = {
      "Id": project.activeProposal.id,
      "ProjetoId": project.id
    }

    return this.http.post(this.baseUrl + '/sendmail', data, options)
      .map((response: Response) => {
        console.log(response);
        
        // let proposalResp = JSON.parse(response.text());
        // console.log(proposalResp);
        console.log(response.text());

        if (response.text() === "Email enviado com sucesso") {
          return true;
        } 

        return false;
      }).catch(this.handleError);
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
