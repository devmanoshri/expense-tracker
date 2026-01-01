import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardComponent,
  },
  {
    path: 'transactions/:id',
    loadComponent: () => {
      return import('./components/shared/transaction-edit/transaction-edit.component').then(
        (m) => m.TransactionEditComponent,
      );
    },
  },
  {
    path: 'add-transactions',
    loadComponent: () => {
      return import('./components/shared/transaction-edit/transaction-edit.component').then(
        (m) => m.TransactionEditComponent,
      );
    },
  },
  {
    path: 'dashboard',
    loadComponent: () => {
      return import('./components/pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      );
    },
  },
  {
    path: 'manage-transaction',
    loadComponent: () => {
      return import('./components/pages/manage-transaction/manage-transaction.component').then(
        (m) => m.ManageTransactionComponent,
      );
    },
  },
  {
    path: 'chart-preview',
    loadComponent: () => {
      return import('./components/pages/chart-preview/chart-preview.component').then(
        (m) => m.ChartPreviewComponent,
      );
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule {}
