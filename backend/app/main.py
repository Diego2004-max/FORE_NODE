from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, database, ai_service

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="Forenode AI - Backend API",
    description="Real-world Predictive Supply-Demand Matching Engine",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://127.0.0.1:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Forenode AI Engine v2.0 (Real Data) is running"}

@app.post("/api/v1/predictions/demand", response_model=ai_service.PredictionResponse, status_code=status.HTTP_200_OK)
async def predict_agricultural_demand(
    request: ai_service.PredictionRequest,
    db: Session = Depends(database.get_db)
):
    try:
        product = db.query(models.Product).filter(models.Product.id == request.product_id).first()
        if not product:
            new_product = models.Product(
                id=request.product_id, 
                name=f"Nariño Agricultural Node #{request.product_id}", 
                category="Real-Time Open-Meteo & ML"
            )
            db.add(new_product)
            db.commit()

        month = request.target_date.month
        
        # Consumo real de API climática y ejecución de modelo IA en paralelo/async
        temp, rain, predicted_kg = await ai_service.ai_model_instance.predict_real_demand(
            month=month,
            lat=request.latitude,
            lon=request.longitude
        )
        
        confidence = 0.91 if rain < 100 else 0.78

        db_prediction = models.DemandPrediction(
            product_id=request.product_id,
            target_date=request.target_date,
            predicted_demand_kg=round(predicted_kg, 2),
            confidence_score=confidence
        )
        
        db.add(db_prediction)
        db.commit()
        db.refresh(db_prediction)

        return ai_service.PredictionResponse(
            product_id=request.product_id,
            target_date=request.target_date,
            forecast_temperature_c=temp,
            forecast_rainfall_mm=rain,
            predicted_demand_kg=round(predicted_kg, 2),
            confidence_score=confidence
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Real AI Pipeline Error: {str(e)}"
        )