import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/shared/header/header.component';
import { CategoriesService } from './services/categories.service';
import { MessageComponent } from './components/shared/message/message.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, MessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.categoriesService.loadCategories();
  }
  title = '♡ expense-tracker';
}
