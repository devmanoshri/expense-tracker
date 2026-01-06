import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Category } from '../../../models/category.model';
import { Transaction } from '../../../models/transaction.model';

@Component({
  selector: 'app-transaction-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-chart.component.html',
  styleUrls: ['./transaction-chart.component.scss'],
})
export class TransactionChartComponent implements AfterViewInit, OnChanges {
  @Input() mainTransactionList: Transaction[] = [];
  @Input() mainCategoryList: Category[] = [];

  allTransactions: Transaction[] = [];
  transactions: Transaction[] = [];

  selectedRange: 'currentmonth' | 'last3' | 'last6' | 'last12' | 'all' = 'all';
  @Output() transactionsChange = new EventEmitter<Transaction[]>();

  @ViewChild('chartCanvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  private chart!: Chart;
  private viewReady = false;

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mainTransactionList']) {
      this.allTransactions = [...this.mainTransactionList];
      this.applyDateFilter();
    }
  }

  getChartCategoryName(catId: string): string {
    return (
      this.mainCategoryList.find((category) => category.id === catId)?.name ||
      'Unknown'
    );
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
    if (!this.canvas || !this.viewReady || this.transactions.length === 0)
      return;

    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Group by type and category
    const incomeMap = new Map<string, number>();
    const expenseMap = new Map<string, number>();

    this.transactions.forEach((t) => {
      const name = this.getChartCategoryName(t.categoryId);

      if (t.type === 'income') {
        incomeMap.set(name, (incomeMap.get(name) || 0) + t.amount);
      } else {
        expenseMap.set(name, (expenseMap.get(name) || 0) + t.amount);
      }
    });

    const incomeLabels = Array.from(incomeMap.keys());
    const incomeData = Array.from(incomeMap.values());

    const expenseLabels = Array.from(expenseMap.keys());
    const expenseData = Array.from(expenseMap.values());

    // Generate colors for each category slice
    const generateColors = (n: number, baseColor: string) =>
      Array.from({ length: n }, (_, i) => `hsl(${(i * 360) / n}, 70%, 50%)`);

    const incomeColors = generateColors(incomeLabels.length, '#16a34a');
    const expenseColors = generateColors(expenseLabels.length, '#dc2626');

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [...incomeLabels, ...expenseLabels],
        datasets: [
          {
            data: [...incomeData, ...expenseData],
            backgroundColor: [...incomeColors, ...expenseColors],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
      },
    });
  }
}
