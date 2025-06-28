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
    try:
        print("🔍 Received request with description:", job.description)
        profiles = fetch_profiles(job.description)
        print("✅ Profiles extracted:", profiles)
        return {"profiles": profiles}
    except Exception as e:
        print("❌ ERROR during scraping:", str(e))
        return {"error": str(e)}
