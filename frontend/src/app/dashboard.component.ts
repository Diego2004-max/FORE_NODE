import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, PredictionResponse } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnDestroy {
  private readonly dashboardService = inject(DashboardService);
  private worker: Worker | null = null;
  
  public forecastData = signal<PredictionResponse | null>(null);
  public workerInsights = signal<any>(null);
  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);
  public isDarkMode = signal<boolean>(false);

  constructor() {
    if (typeof Worker !== 'undefined') {
      try {
        this.worker = new Worker(new URL('./dashboard.worker', import.meta.url), { type: 'module' });
        this.worker.onmessage = ({ data }) => {
          this.workerInsights.set(data);
          this.isLoading.set(false);
        };
      } catch (e) {
        console.warn('Worker initialization failed', e);
      }
    }
  }

  public toggleTheme(): void {
    this.isDarkMode.update(mode => !mode);
    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  public fetchPrediction(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.workerInsights.set(null);

    // Coordenadas reales de Pasto, Nariño para la API climática
    const payload = {
      product_id: 1,
      target_date: new Date().toISOString(),
      latitude: 1.2136,
      longitude: -77.2811
    };

    this.dashboardService.getDemandForecast(payload).subscribe({
      next: (response) => {
        this.forecastData.set(response);
        if (this.worker) {
          this.worker.postMessage(response);
        } else {
          this.isLoading.set(false);
        }
      },
      error: () => {
        this.errorMessage.set('Forenode Real-Time AI Engine failed to respond. Verify backend connection.');
        this.isLoading.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.worker?.terminate();
  }
}