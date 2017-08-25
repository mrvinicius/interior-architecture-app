import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Supplier } from './supplier';

@Injectable()
export class SupplierService {
  private allSuppliers: Supplier[];

  constructor() {
    
  }

  getAll() {

  }

  getOne() {

  }

  getOneByName(name: string): Observable<Supplier> {
    return Observable.of(true);
  }
}
