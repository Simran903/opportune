from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from scraper import fetch_profiles

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5000"
    ],
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
