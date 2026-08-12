from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from scraper import fetch_profiles

load_dotenv()

app = FastAPI()

allowed_origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Job(BaseModel):
    description: str
    employer_id: int
    job_id: int

@app.post("/scrape")
def scrape(job: Job):
    try:
        profiles = fetch_profiles(job.description, job.employer_id, job.job_id)
        return {"profiles": profiles}
    except Exception as e:
        return {"error": str(e)}
