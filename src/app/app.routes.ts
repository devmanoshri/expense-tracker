import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { TransactionEditComponent } from './components/transactions/transaction-edit/transaction-edit.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: TransactionsComponent
    },
    { path: 'transactions/edit/:id', component: TransactionEditComponent },
    {
        path: 'add',
        loadComponent: () => {
            return import('./components/transactions/transaction-add/transaction-add.component').then(m => m.TransactionAddComponent);
        }
    },
    {
        path: 'transactions',
        loadComponent: () => {
            return import('./components/transactions/transaction-list/transaction-list.component').then(m=>m.TransactionListComponent);
        }

    },
    {
        path: 'chart',
        loadComponent: () => {
            return import('./components/transactions/transaction-chart/transaction-chart.component').then(m => m.TransactionChartComponent);
        }
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
