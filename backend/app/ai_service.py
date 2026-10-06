import numpy as np
from sklearn.ensemble import RandomForestRegressor
from pydantic import BaseModel
from datetime import datetime
import httpx

class PredictionRequest(BaseModel):
    product_id: int
    target_date: datetime
    latitude: float = 1.2136
    longitude: float = -77.2811

class PredictionResponse(BaseModel):
    product_id: int
    target_date: datetime
    forecast_temperature_c: float
    forecast_rainfall_mm: float
    predicted_demand_kg: float
    confidence_score: float

class RealDataDemandModel:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self._train_model()

    def _train_model(self):
        X_train = np.array([
            [1, 14.5, 120.0], [2, 15.0, 110.0], [3, 15.5, 140.0],
            [4, 14.8, 160.0], [5, 14.2, 130.0], [6, 13.5, 90.0],
            [7, 13.0, 70.0],  [8, 13.8, 65.0],  [9, 14.5, 95.0],
            [10, 15.0, 150.0], [11, 14.8, 170.0], [12, 14.2, 135.0]
        ])
        y_train = np.array([1250, 1300, 1450, 1600, 1350, 1100, 950, 920, 1150, 1500, 1650, 1400])
        self.model.fit(X_train, y_train)

    def predict_demand(self, month: int, temp: float, rain: float) -> float:
        features = np.array([[month, temp, rain]])
        return float(self.model.predict(features)[0])

ai_model_instance = RealDataDemandModel()