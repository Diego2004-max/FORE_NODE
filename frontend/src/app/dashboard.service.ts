import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MatchingRequest {
  product_id: number;
  product_name: string;
  region_name: string;
  latitude: number;
  longitude: number;
  target_date: string;
}

export interface MatchingResponse {
  product_id: number;
  product_name: string;
  region_name: string;
  target_date: string;
  forecast_temperature_c: number;
  forecast_rainfall_mm: number;
  predicted_demand_kg: number;
  available_supply_kg: number;
  deficit_or_surplus_kg: number;
  market_status: string;
  confidence_score: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8000/api/v1/matching/engine';

  runMatchingEngine(payload: MatchingRequest): Observable<MatchingResponse> {
    return this.http.post<MatchingResponse>(this.API_URL, payload);
  }
}