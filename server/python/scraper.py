import time
import requests
from keybert import KeyBERT
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

DEBUG = True


# -----------------------------
# LOGGING HELPER
# -----------------------------
def debug_log(*args):
    if DEBUG:
        print(*args)


# -----------------------------
# KEYWORD EXTRACTION
# -----------------------------
def extract_keywords(text: str, top_n: int = 5):
    """Extract keywords using KeyBERT."""
    kw_model = KeyBERT()
    keywords = kw_model.extract_keywords(text, top_n=top_n)
    return [kw[0].lower() for kw in keywords]


# -----------------------------
# SELENIUM DRIVER SETUP
# -----------------------------
def init_driver():
    """Initialize Selenium Chrome driver."""
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument(
        "user-agent=Mozilla/5.0 (X11; Linux x86_64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/114.0.0.0 Safari/537.36"
    )

    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=options)


# -----------------------------
# URL HELPERS
# -----------------------------
def is_linkedin_profile_url(url: str) -> bool:
    return (
        url
        and "linkedin.com/in/" in url
        and "google.com" not in url
        and "accounts.google.com" not in url
    )


def clean_link(url: str) -> str:
    return url.split("?")[0].split("&")[0]


# -----------------------------
# BACKEND API HELPERS
# -----------------------------
def fetch_seen_profiles(employer_id: int):
    """Fetch already seen LinkedIn profile URLs for an employer from backend."""
    try:
        response = requests.get(
            f"http://localhost:5000/api/employer/{employer_id}/seen-profiles"
        )
        return set(response.json().get("seenProfiles", []))
    except Exception as e:
        debug_log("Error fetching seen profiles:", str(e))
        return set()


def save_profiles(employer_id: int, profiles: list[dict]):
    """Send new profiles to backend to save in DB."""
    try:
        response = requests.post(
            f"http://localhost:5000/api/employer/{employer_id}/profiles",
            json={"profiles": profiles},
        )
        if response.status_code == 200:
            debug_log("✅ Saved profiles successfully")
        else:
            debug_log("❌ Failed to save profiles:", response.status_code, response.text)
    except Exception as e:
        debug_log("Error saving profiles:", str(e))


# -----------------------------
# MAIN SCRAPER LOGIC
# -----------------------------
def fetch_profiles(description: str, employer_id: int, limit: int = 20):
    """Scrape LinkedIn profiles from Google search results."""
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

    try:
        for keyword in keywords:
            search_keyword = fallback_keywords.get(keyword, keyword)

            for page in range(0, 3):  # scrape first 3 Google pages
                start = page * 10
                query = f'site:linkedin.com/in "{search_keyword} developer" India'
                search_url = f"https://www.google.com/search?q={query}&start={start}"

                debug_log(f"🔍 Searching: {search_url}")

                try:
                    driver.get(search_url)
                    time.sleep(6)  # let Google load

                    links = driver.find_elements(By.CSS_SELECTOR, "a")
                    debug_log(f"Found {len(links)} links")

                    for link in links:
                        href = link.get_attribute("href")
                        if is_linkedin_profile_url(href):
                            url = clean_link(href)
                            if url not in seen_profiles and url not in collected:
                                results.append({"profileUrl": url})
                                collected.add(url)

                        if len(results) >= limit:
                            break

                except Exception as e:
                    debug_log("Error scraping:", str(e))

                if len(results) >= limit:
                    break

            if len(results) >= limit:
                break

    finally:
        driver.quit()

    # Save results to backend
    if results:
        save_profiles(employer_id, results)

    return results[:limit]
