import numpy as np
from sklearn.ensemble import RandomForestRegressor
from pydantic import BaseModel
from datetime import datetime

class PredictionRequest(BaseModel):
    product_id: int
    target_date: datetime
    forecast_temperature_c: float
    forecast_rainfall_mm: float

class PredictionResponse(BaseModel):
    product_id: int
    target_date: datetime
    predicted_demand_kg: float
    confidence_score: float

class ScikitLearnDemandModel:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.is_trained = False
        self._train_mock_model()

    def _train_mock_model(self):
        """
        Trains the model with mock historical data to ensure the 
        endpoint returns logical values during the initial presentation.
        """
        X_mock = np.array([
            [1, 18.0, 50.0], [2, 19.5, 45.0], [3, 20.0, 60.0],
            [4, 17.5, 80.0], [5, 18.2, 55.0], [6, 19.0, 40.0],
            [7, 18.5, 30.0], [8, 19.2, 25.0], [9, 18.8, 45.0],
            [10, 17.0, 75.0], [11, 16.5, 85.0], [12, 17.2, 65.0]
        ])
        
        y_mock = np.array([1200, 1350, 1100, 950, 1250, 1400, 1500, 1450, 1300, 1050, 900, 1150])
        self.model.fit(X_mock, y_mock)
        self.is_trained = True

    def predict_demand(self, month: int, temp: float, rain: float) -> float:
        features = np.array([[month, temp, rain]])
        return float(self.model.predict(features)[0])

ai_model_instance = ScikitLearnDemandModel()