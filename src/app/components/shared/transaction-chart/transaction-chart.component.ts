import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnInit,
  inject,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { Transaction } from '../../../models/transaction.model';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-transaction-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-chart.component.html',
  styleUrls: ['./transaction-chart.component.scss'],
})
export class TransactionChartComponent implements OnInit, AfterViewInit {
  private transactionService = inject(TransactionService);

  allTransactions: Transaction[] = [];
  transactions: Transaction[] = [];

  selectedRange: 'currentmonth' | 'last3' | 'last6' | 'last12' | 'all' = 'all';
  @Output() transactionsChange = new EventEmitter<Transaction[]>();

  @ViewChild('chartCanvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  private chart!: Chart;
  private viewReady = false;

  ngOnInit(): void {
    this.transactionService.getTransactions().subscribe((transactions) => {
      this.allTransactions = transactions;
      this.applyDateFilter();
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.renderChart();
  }

  onChooseDateRange(
    range: 'currentmonth' | 'last3' | 'last6' | 'last12' | 'all',
  ) {
    this.selectedRange = range;
    this.applyDateFilter();
  }

  private applyDateFilter(): void {
    const now = new Date();

    if (this.selectedRange === 'all') {
      this.transactions = [...this.allTransactions];
    } else if (this.selectedRange === 'currentmonth') {
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      this.transactions = this.allTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );
      });
    } else {
      const months =
        this.selectedRange === 'last3'
          ? 3
          : this.selectedRange === 'last6'
            ? 6
            : 12;

      const fromDate = new Date();
      fromDate.setMonth(fromDate.getMonth() - months);

      this.transactions = this.allTransactions.filter(
        (transaction) => new Date(transaction.date) >= fromDate,
      );
    }
    this.transactionsChange.emit(this.transactions);
    this.renderChart();
  }

  private renderChart(): void {
    if (!this.canvas || !this.viewReady) return;

    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const monthlyIncome = Array(12).fill(0);
    const monthlyExpense = Array(12).fill(0);

    this.transactions.forEach((transaction) => {
      const month = new Date(transaction.date).getMonth();
      if (transaction.type === 'income') {
        monthlyIncome[month] += transaction.amount;
      } else {
        monthlyExpense[month] += transaction.amount;
      }
    });

    if (this.chart) {
      this.chart.destroy();
    }

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            label: 'Income',
            data: monthlyIncome,
            backgroundColor: '#16a34a',
          },
          {
            label: 'Expense',
            data: monthlyExpense,
            backgroundColor: '#dc2626',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
        },
      },
    };

    this.chart = new Chart(ctx, config);
  }
}
