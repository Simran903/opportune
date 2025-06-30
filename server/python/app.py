from fastapi import FastAPI
from pydantic import BaseModel
from scraper import fetch_profiles

app = FastAPI()

class Job(BaseModel):
    description: str

@app.get("/")
def root():
    return {"message": "Python scraper is live"}

@app.post("/scrape")
def scrape(job: Job):
    print("[SCRAPE] Incoming POST /scrape request")
    try:
        print("[SCRAPE] Description received:", job.description[:50])
        profiles = fetch_profiles(job.description)
        print("[SCRAPE] Profiles extracted:", profiles)
        return {"profiles": profiles}
    except Exception as e:
        print("[SCRAPE] ERROR:", repr(e))
        return {"error": str(e)}
