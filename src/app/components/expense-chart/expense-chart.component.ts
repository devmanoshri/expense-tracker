import { Component, Input, OnChanges } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Transaction } from '../../models/transaction.model';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-expense-chart',
  templateUrl: './expense-chart.component.html',
  styleUrls: ['./expense-chart.component.scss']
})
export class ExpenseChartComponent implements OnChanges {

  @Input() transactions: Transaction[] = [];
  chart: Chart | undefined;

  constructor(private categoriesService: CategoriesService) { }

  ngOnChanges(): void {
    if (this.transactions.length) {
      this.renderChart();
    }
  }

  renderChart(): void {

    const incomeTotal = 0;
    const expenseTotals: Record<string, number> = {};

    let totalIncome = 0;

    this.transactions.forEach(t => {
      if (t.type === 'income') {
        totalIncome += t.amount;
      } else {
        if (t.categoryId) {
          const categoryName =
            this.categoriesService.getCategoryName(t.categoryId);
          expenseTotals[categoryName] = (expenseTotals[categoryName] || 0) + t.amount;
        }
      }
    });

    const labels = ['Income', ...Object.keys(expenseTotals)];
    const data = [totalIncome, ...Object.values(expenseTotals)];

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('expenseChart', {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: [
              'green',              // income
              '#ff4d4d', '#ff944d', '#ffd24d', '#ff6666' // expenses
            ]
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
}
