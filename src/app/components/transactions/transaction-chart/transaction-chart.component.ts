import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { Transaction } from '../../../models/transaction.model';

@Component({
  selector: 'app-transaction-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-chart.component.html',
  styleUrls: ['./transaction-chart.component.scss']
})
export class TransactionChartComponent
  implements AfterViewInit, OnChanges {

  @Input() transactions: Transaction[] = [];

  @ViewChild('chartCanvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  private chart!: Chart;
  private viewReady = false;

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.viewReady && changes['transactions']) {
      this.renderChart();
    }
  }

  private renderChart(): void {
    if (!this.canvas || this.transactions.length === 0) return;

    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const monthlyIncome = Array(12).fill(0);
    const monthlyExpense = Array(12).fill(0);

    this.transactions.forEach(t => {
      const month = new Date(t.date).getMonth();
      if (t.type === 'income') {
        monthlyIncome[month] += t.amount;
      } else {
        monthlyExpense[month] += t.amount;
      }
    });

    if (this.chart) {
      this.chart.destroy();
    }

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: [
          'Jan','Feb','Mar','Apr','May','Jun',
          'Jul','Aug','Sep','Oct','Nov','Dec'
        ],
        datasets: [
          {
            label: 'Income',
            data: monthlyIncome,
            backgroundColor: '#16a34a'
          },
          {
            label: 'Expense',
            data: monthlyExpense,
            backgroundColor: '#dc2626'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }
}
