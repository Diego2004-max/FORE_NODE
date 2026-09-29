import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, PredictionResponse } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private readonly dashboardService = inject(DashboardService);

  public forecastData = signal<PredictionResponse | null>(null);
  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);
  public isDarkMode = signal<boolean>(false);

  public toggleTheme(): void {
    this.isDarkMode.update((mode) => !mode);
    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  public fetchPrediction(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Payload reflecting regional agricultural conditions (e.g., Nariño crops)
    const payload = {
      product_id: 1,
      target_date: new Date().toISOString(),
      forecast_temperature_c: 17.5,
      forecast_rainfall_mm: 60.5,
    };

    this.dashboardService.getDemandForecast(payload).subscribe({
      next: (response) => {
        this.forecastData.set(response);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Forenode AI Engine failed to respond. Verify backend connection.');
        this.isLoading.set(false);
      },
    });
  }
}

if (typeof Worker !== 'undefined') {
  // Create a new
  const worker = new Worker(new URL('./dashboard.worker', import.meta.url));
  worker.onmessage = ({ data }) => {
    console.log(`page got message: ${data}`);
  };
  worker.postMessage('hello');
} else {
  // Web Workers are not supported in this environment.
  // You should add a fallback so that your program still executes correctly.
}
