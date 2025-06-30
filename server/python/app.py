from fastapi import FastAPI
from pydantic import BaseModel
from scraper import fetch_profiles

app = FastAPI()

class Job(BaseModel):
    description: str

@app.post("/scrape")
def scrape(job: Job):
    try:
        profiles = fetch_profiles(job.description)
        return {"profiles": profiles}
    except Exception as e:
        return {"error": str(e)}
