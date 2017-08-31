import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Supplier } from './supplier';

@Injectable()
export class SupplierService {
  private allSuppliers: Supplier[];

  constructor() {
    this.allSuppliers = [
      {
        id: '45t4t-s5y485-da564',
        name: 'Breton',
        // email: 'atend@breton.com'
      },
      {
        id: 'u6f9w-f5623r-s8782',
        name: 'Brentwood',
        // email: 'sup@brentwood.com'
      },
      {
        id: '45t4t-56421d-da564',
        name: "Bell' arte",
        // email: 'contato@bellarte.com'
      },
      {
        id: '45t4t-6tqy85-da564',
        name: 'Coral',
        // email: 'casa@coral.com'
      },
      {
        id: '45t4t-5s5y48-da564',
        name: 'Ornare',
        // email: 'orcamento@ornare.com'
      },
      {
        id: 'y547u-f5u738-ki4fa',
        name: 'Deca',
        // email: 'atendimento@breton.com'
      },
    ]
  }

  getAll(): Observable<Supplier[]> {
    return Observable.of(this.allSuppliers);
  }

  getOne() {

  }

  getOneByName(name: string): Observable<Supplier> {
    let sup = this.allSuppliers.find(supplier => supplier.name === name)
    return Observable.of(sup);
  }
}
