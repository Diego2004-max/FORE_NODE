import { Component, inject, signal, OnDestroy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService, MatchingResponse } from './dashboard.service';

interface RegionNode {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

interface CropProduct {
  id: number;
  name: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnDestroy {
  private readonly dashboardService = inject(DashboardService);
  private worker: Worker | null = null;
  public logout = output<boolean>();

  public regions: RegionNode[] = [
    { name: 'Pasto', country: 'Colombia', lat: 1.2136, lon: -77.2811 },
    { name: 'Ipiales', country: 'Colombia', lat: 0.8248, lon: -77.5846 },
    { name: 'Túquerres', country: 'Colombia', lat: 1.0844, lon: -77.6236 },
    { name: 'La Unión', country: 'Colombia', lat: 1.6058, lon: -77.1331 },
    { name: 'Buesaco', country: 'Colombia', lat: 1.3703, lon: -77.1583 }
  ];

  public crops: CropProduct[] = [
    { id: 1, name: 'Café de Altura Arábigo' },
    { id: 2, name: 'Papa Pastusa' },
    { id: 3, name: 'Lulo Andino' },
    { id: 4, name: 'Quinoa Real de Nariño' }
  ];

  public selectedRegion = signal<RegionNode>(this.regions[0]);
  public selectedCrop = signal<CropProduct>(this.crops[0]);

  public matchingData = signal<MatchingResponse | null>(null);
  public workerInsights = signal<any>(null);
  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);
  public isDarkMode = signal<boolean>(false);

  constructor() {
    document.documentElement.classList.remove('dark');
    if (typeof Worker !== 'undefined') {
      try {
        this.worker = new Worker(new URL('./dashboard.worker', import.meta.url), { type: 'module' });
        this.worker.onmessage = ({ data }) => {
          this.workerInsights.set(data);
          this.isLoading.set(false);
        };
      } catch (e) {
        console.warn('Worker init error', e);
      }
    }
  }

  public toggleTheme(): void {
    this.isDarkMode.update(m => !m);
    const htmlEl = document.documentElement;
    if (this.isDarkMode()) {
      htmlEl.classList.add('dark');
    } else {
      htmlEl.classList.remove('dark');
    }
  }

  public executeMatchingEngine(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.workerInsights.set(null);

    const payload = {
      product_id: this.selectedCrop().id,
      product_name: this.selectedCrop().name,
      region_name: this.selectedRegion().name,
      latitude: this.selectedRegion().lat,
      longitude: this.selectedRegion().lon,
      target_date: new Date().toISOString()
    };

    this.dashboardService.runMatchingEngine(payload).subscribe({
      next: (res) => {
        this.matchingData.set(res);
        if (this.worker) {
          this.worker.postMessage(res);
        } else {
          this.isLoading.set(false);
        }
      },
      error: () => {
        this.errorMessage.set('Error crítico conectando con el motor global de FastAPI y la base de datos.');
        this.isLoading.set(false);
      }
    });
  }

  public onLogout(): void {
    this.logout.emit(true);
  }

  ngOnDestroy(): void {
    this.worker?.terminate();
  }
}
