import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Product } from './shared/product';
import { ProductService } from '../product/shared/product.service';
import { Supplier } from './shared/supplier';
import { SupplierService } from '../supplier/shared/supplier.service';

@Component({
  selector: 'abx-budgets',
  // TODO: Tornar independente do módulo layout
  templateUrl: './budgets.component.html',
  styles: []
})
export class BudgetsComponent implements OnInit {
  public suppliers: Supplier[];
  public products: Product[];

  constructor(
    private supplierServ: SupplierService,
    private productServ: ProductService
    
  ) {
    supplierServ.getAll().subscribe(suppliers => this.suppliers = suppliers);

    // this.suppliers$ = supplierServ.getAll().map(suppliers => {
    //   let suppliersKeys = {};
    //   suppliers.forEach(sup => suppliersKeys[sup.name] = null)
    //   return Observable.of(suppliersKeys);
    // });
  }


  /**
   * 
   * @param supplier 
   */
  fetchProducts(supplier: Supplier) {
    console.log(supplier);
  }

  ngOnInit() {
  }
}
