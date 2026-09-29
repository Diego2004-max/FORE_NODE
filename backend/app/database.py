from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# In a production environment, this URI would come from an environment variable (.env)
SQLALCHEMY_DATABASE_URL = "postgresql://forenode_admin:supersecretpassword@localhost:5432/forenode_db"

# Create the engine. We use standard synchronous engine here as Scikit-Learn 
# operations are CPU-bound, but we will wrap them in async routes in FastAPI.
engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """
    Dependency to yield a database session for each request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()