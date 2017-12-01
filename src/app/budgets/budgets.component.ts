import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { MaterializeDirective, MaterializeAction } from 'angular2-materialize';

import { Observable } from 'rxjs';

import { AuthService } from './../core/auth.service';
import { BudgetRequest } from './shared/budget-request';
import { BudgetsService } from './shared/budgets.service';
import { Product } from './shared/product';
import { ProductService } from '../product/shared/product.service';
import { Supplier } from './shared/supplier';
import { SupplierService } from '../supplier/shared/supplier.service';
import { UserService } from '../user/shared/user.service';

@Component({
  selector: 'abx-budgets',
  // TODO: Tornar independente do módulo layout
  templateUrl: './budgets.component.html'
})
export class BudgetsComponent implements OnInit {
  public suppliers: Supplier[];
  // public products: Product[];
  public products$: Observable<Product[]>;
  // public budgetRequests: BudgetRequest[] = [];
  public budgetRequests$: Observable<BudgetRequest[]>;
  globalActions = new EventEmitter<string | MaterializeAction>();

  constructor(
    private supplierServ: SupplierService,
    private productServ: ProductService,
    private dialogServ: MatDialog,
    private budgetsServ: BudgetsService,
    private userServ: UserService,
    private authServ: AuthService
  ) {
    supplierServ.getAll().subscribe(suppliers => this.suppliers = suppliers);
  }

  ngOnInit() {
    this.budgetRequests$ = this.budgetsServ
      .getAll(this.authServ.getCurrentUser().id);
  }

  /**
   * 
   * @param supplier 
   */
  fetchProducts(supplier: Supplier): void {
    this.products$ = this.productServ.getAllBySupplier(supplier.id);
  }

  handleBudgetRequest(budgetRequest: BudgetRequest): void {
    this.openConfirmDialog(budgetRequest, this.dialogServ)
      .subscribe(confirm => {
        if (confirm) {
          const currentUser = this.authServ.getCurrentUser();

          Materialize.toast('Enviando...', 20000);

          this.checkUser(currentUser.id, this.userServ).subscribe(
            (user) => {
              this.budgetsServ
                .sendBudgetRequest(budgetRequest, user.id)
                .subscribe(req => {
                  (<any>Materialize).Toast.removeAll();
                  Materialize.toast('Solicitação enviada!', 3000);

                });
            },
            (err) => {
              // Não encontrado pelo ID
              if (err.status === 404) {
                this.userServ
                  .add(currentUser)
                  .flatMap(user => this.budgetsServ.sendBudgetRequest(budgetRequest, user.id))
                  .subscribe(req => {
                    (<any>Materialize).Toast.removeAll();
                    Materialize.toast('Solicitação enviada!', 3000);

                  });
              }
            });
        }
      });
  }

  openConfirmDialog(budgetRequest: BudgetRequest, dialogServ): Observable<any> {
    return dialogServ.open(RequestConfirmationComponent, {
      width: '250px',
      data: budgetRequest
    }).afterClosed();
  }

  checkUser(userId, userService: UserService): Observable<any> {
    return userService.getOne(userId);
  }
}

@Component({
  selector: 'request-confirmation',
  template: `
  <h2 mat-dialog-title>Deseja enviar a solicitação?</h2>
  <mat-dialog-content>
    <div>
      <label class="readonly-value-label">fornecedor</label>
      <p>{{data.supplier.name}}</p>
    </div>
    <div>
      <label class="readonly-value-label">pontos de venda</label>
      <p>
        <ng-container *ngFor="let sub of data.supplier.stores; let i = index;">
          {{sub.name}}<ng-container *ngIf="(i+1) < data.supplier.stores.length">, </ng-container>
        </ng-container>
      <p>
    </div>
    <div *ngIf="data.product">
      <label class="readonly-value-label">produto</label>
      <p>{{data.product.name}}</p>
    </div>
    <div *ngIf="data.isNewProduct">
      <label class="readonly-value-label">produto</label>
      <p>{{data.newProductName}}</p>
    </div>
    <div>
      <label class="readonly-value-label">quantidade</label>
      <p>{{data.quantity}}</p>
    </div>
    <div *ngIf="data.color && data.color.length">
      <label class="readonly-value-label">cor</label>
      <p>{{data.color}}</p>
    </div>
    <div *ngIf="data.note && data.note.length">
      <label class="readonly-value-label">observações</label>
      <p>{{data.note}}</p>
    </div>
  </mat-dialog-content>
  <mat-dialog-actions style="display: block; text-align: right;">
    <button (click)="cancel()" class="btn-flat short-pad waves-effect waves-dark">Cancelar</button>
    <!-- Can optionally provide a result for the closing dialog. -->
    <button (click)="confirm()" class="btn short-pad waves-effect waves-light">Enviar</button>
  </mat-dialog-actions>
  `
})
export class RequestConfirmationComponent {
  constructor(
    public dialogRef: MatDialogRef<BudgetsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public readonly data: BudgetRequest) { }

  cancel() {
    this.dialogRef.close(false);
  }

  confirm() {
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.cancel();
  }
}