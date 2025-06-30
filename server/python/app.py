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


@app.get("/debug")
def debug():
    try:
        from selenium import webdriver
        from selenium.webdriver.chrome.options import Options
        from selenium.webdriver.chrome.service import Service

        options = Options()
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        driver = webdriver.Chrome(service=Service(), options=options)
        driver.get("https://www.google.com")
        title = driver.title
        driver.quit()
        return {"message": "Selenium ran successfully", "title": title}
    except Exception as e:
        return {"error": str(e)}
