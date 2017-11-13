import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Observable } from 'rxjs';

import { BudgetRequest } from './shared/budget-request';
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
  // public products: Product[];
  public products$: Observable<Product[]>;

  constructor(
    private supplierServ: SupplierService,
    private productServ: ProductService,
    private dialogServ: MatDialog

  ) {
    supplierServ.getAll().subscribe(suppliers => this.suppliers = suppliers);
  }


  /**
   * 
   * @param supplier 
   */
  fetchProducts(supplier: Supplier) {
    this.products$ = this.productServ.getAllBySupplier(supplier.id);
  }


  handleBudgetRequest(budgetRequest: BudgetRequest) {
    console.log(budgetRequest);
    
  }

  ngOnInit() {
  }
}
