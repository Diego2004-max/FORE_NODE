from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    role = Column(String, default="Logistics Manager")  # Admin, Producer, Manager

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String)
    region = Column(String, default="Nariño, Colombia")
    latitude = Column(Float, default=1.2136)
    longitude = Column(Float, default=-77.2811)

class DemandPrediction(Base):
    __tablename__ = "demand_predictions"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    target_date = Column(DateTime)
    predicted_demand_kg = Column(Float)
    available_supply_kg = Column(Float, default=1000.0)
    gap_status = Column(String, default="Balanced")
    confidence_score = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)