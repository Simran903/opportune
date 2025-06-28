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
    print("[START] /scrape called")
    try:
        print("[STEP 1] Extracting keywords")
        print("• Description:", job.description[:50])
        
        print("[STEP 2] Launching WebDriver...")
        profiles = fetch_profiles(job.description)
        
        print("[STEP 3] Profiles fetched:", profiles)
        print("[DONE] /scrape finished")
        return {"profiles": profiles}
    except Exception as e:
        print("[ERROR] during scraping:", repr(e))
        raise e  # Let Render capture the stack trace

