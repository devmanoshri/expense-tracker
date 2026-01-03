import { Component, EventEmitter, Input, Output } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-modal',
  imports: [A11yModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Input() header = '';
  @Output() modalClose = new EventEmitter<void>();
}
