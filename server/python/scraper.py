import time
import json
import re
from keybert import KeyBERT
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import requests

DEBUG = True

def debug_log(*args):
    if DEBUG:
        print(*args)

def extract_keywords(text):
    kw_model = KeyBERT()
    keywords = kw_model.extract_keywords(text, top_n=5)
    return [kw[0].lower() for kw in keywords]

def init_driver():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument(
        "user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    )
    return webdriver.Chrome(options=options)

def is_linkedin_profile_url(url):
    return (
        url
        and "linkedin.com/in/" in url
        and "google.com" not in url
        and "accounts.google.com" not in url
    )

def clean_link(url):
    return url.split("?")[0].split("&")[0]

# -----------------------------
# MAIN SCRAPER LOGIC
# -----------------------------

def fetch_seen_profiles(employer_id):
    """Call backend API to get already seen LinkedIn profile URLs for the employer."""
    try:
        response = requests.get(f"http://localhost:3001/api/employer/{employer_id}/seen-profiles")
        return set(response.json().get("seenProfiles", []))
    except Exception as e:
        debug_log("Error fetching seen profiles:", str(e))
        return set()

def fetch_profiles(description, employer_id):
    keywords = extract_keywords(description)
    debug_log("Extracted Keywords:", keywords)

    seen_profiles = fetch_seen_profiles(employer_id)
    debug_log("Already seen:", seen_profiles)

    driver = init_driver()
    results = []
    collected = set()

    fallback_keywords = {
        "rxjs": "angular",
        "ngrx": "angular",
        "typescript": "frontend",
        "javascript": "frontend",
    }

    for keyword in keywords:
        search_keyword = fallback_keywords.get(keyword, keyword)

        for page in range(0, 3):
            start = page * 10
            query = f'site:linkedin.com/in "{search_keyword} developer" India'
            search_url = f"https://www.google.com/search?q={query}&start={start}"

            debug_log(f"Searching: {search_url}")

            try:
                driver.get(search_url)
                time.sleep(6)

                links = driver.find_elements(By.CSS_SELECTOR, "a")
                debug_log(f"Found {len(links)} links")

                for link in links:
                    href = link.get_attribute("href")
                    if is_linkedin_profile_url(href):
                        url = clean_link(href)
                        if url not in seen_profiles and url not in collected:
                            results.append({"profileUrl": url})
                            collected.add(url)

                    if len(results) >= 20:
                        break

            except Exception as e:
                debug_log("Error scraping:", str(e))

            if len(results) >= 20:
                break

        if len(results) >= 20:
            break

    driver.quit()
    return results[:20]