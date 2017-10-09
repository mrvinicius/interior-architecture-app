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
        stores: [
          { name: 'Tatuapé', email: 'tatu@loja.com' },
          { name: 'Água Rasa', email: 'agrasa@loja.com' }
        ]
        // email: 'atend@breton.com'
      },
      {
        id: 'u6f9w-f5623r-s8782',
        name: 'Brentwood',
        stores: [
          { name: 'Pari', email: 'pari@loja.com' },
          { name: 'Brás', email: 'bras@loja.com' }
        ]
        // email: 'sup@brentwood.com'
      },
      {
        id: '45t4t-56421d-da564',
        name: "Bell' arte",
        stores: [
          { name: 'Vila Olímpia', email: 'vilo@loja.com' },
          { name: 'Berrini', email: 'berrini@loja.com' }
        ]
        // email: 'contato@bellarte.com'
      },
      {
        id: '45t4t-6tqy85-da564',
        name: 'Coral',
        stores: [
          { name: 'Itaquera', email: 'itq@loja.com' }
        ]
        // email: 'casa@coral.com'
      },
      {
        id: '45t4t-5s5y48-da564',
        name: 'Ornare',
        stores: []
      }
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
