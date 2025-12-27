import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CategoriesService } from './services/categories.service';
import { HeaderComponent } from "./components/header/header.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.categoriesService.loadCategories();
  }
  title = '♡ expense-tracker';
}
