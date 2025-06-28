# app.py
from fastapi import FastAPI, Request
from pydantic import BaseModel
from scraper import fetch_profiles

app = FastAPI()

class Job(BaseModel):
    description: str

@app.post("/scrape")
async def scrape(job: Job):
    try:
        results = fetch_profiles(job.description)
        return { "profiles": results }
    except Exception as e:
        return { "error": str(e) }
