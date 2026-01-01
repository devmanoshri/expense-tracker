import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartPreviewComponent } from './chart-preview.component';

describe('ChartPreviewComponent', () => {
  let component: ChartPreviewComponent;
  let fixture: ComponentFixture<ChartPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartPreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
