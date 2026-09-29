import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PredictionRequest {
  product_id: number;
  target_date: string;
  latitude: number;
  longitude: number;
}

export interface PredictionResponse {
  product_id: number;
  target_date: string;
  forecast_temperature_c: number;
  forecast_rainfall_mm: number;
  predicted_demand_kg: number;
  confidence_score: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8000/api/v1/predictions/demand';

  getDemandForecast(payload: PredictionRequest): Observable<PredictionResponse> {
    return this.http.post<PredictionResponse>(this.API_URL, payload);
  }
}