from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from . import models, database, ai_service

# Generate database tables if they don't exist
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="Forenode AI - Backend API",
    description="Predictive Supply-Demand Matching Engine",
    version="1.0.0"
)

@app.get("/")
def read_root():
    return {"status": "Forenode AI Engine is running"}

@app.post("/api/v1/predictions/demand", response_model=ai_service.PredictionResponse, status_code=status.HTTP_200_OK)
def predict_agricultural_demand(
    request: ai_service.PredictionRequest,
    db: Session = Depends(database.get_db)
):
    try:
        month = request.target_date.month
        
        predicted_kg = ai_service.ai_model_instance.predict_demand(
            month=month,
            temp=request.forecast_temperature_c,
            rain=request.forecast_rainfall_mm
        )
        
        confidence = 0.88 if request.forecast_rainfall_mm < 70 else 0.72

        db_prediction = models.DemandPrediction(
            product_id=request.product_id,
            target_date=request.target_date,
            predicted_demand_kg=round(predicted_kg, 2),
            confidence_score=confidence
        )
        
        db.add(db_prediction)
        db.commit()
        db.refresh(db_prediction)

        return db_prediction

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Pipeline Error: {str(e)}"
        )