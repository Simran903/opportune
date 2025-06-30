import time
import json
import re
from keybert import KeyBERT
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

# -----------------------------
# CONFIGURATION
# -----------------------------
USE_BING = False  # ✅ Change to True to use Bing instead of Google
DEBUG = True      # ✅ Set to False to suppress console output
USE_FAKE_DATA = False  # ✅ Use True for testing without scraping

# -----------------------------
# UTILITIES
# -----------------------------

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
        and "bing.com" not in url
        and "accounts.google.com" not in url
    )

def clean_link(url):
    return url.split("?")[0].split("&")[0]

# -----------------------------
# MAIN SCRAPER FUNCTION
# -----------------------------

def fetch_profiles(description):
    if USE_FAKE_DATA:
        debug_log("🧪 Returning fake data for testing")
        return [
            {"profileUrl": "https://linkedin.com/in/test-user-1"},
            {"profileUrl": "https://linkedin.com/in/test-user-2"},
        ]

    keywords = extract_keywords(description)
    debug_log("🔍 Extracted Keywords:", keywords)

    driver = init_driver()
    results = []

    fallback_keywords = {
        "rxjs": "angular",
        "ngrx": "angular",
        "typescript": "frontend",
        "javascript": "frontend",
    }

    for keyword in keywords:
        search_keyword = fallback_keywords.get(keyword, keyword)

        if USE_BING:
            query = f'site:linkedin.com/in {search_keyword} developer India'
            search_url = f"https://www.bing.com/search?q={query}"
        else:
            query = f'site:linkedin.com/in "{search_keyword} developer" India'
            search_url = f"https://www.google.com/search?q={query}"

        debug_log(f"🔗 Searching for: {search_url}")

        try:
            driver.get(search_url)
            time.sleep(7)  # Let the page load

            links = driver.find_elements(By.CSS_SELECTOR, "a")
            debug_log(f"🔗 Found {len(links)} links")

            found = 0
            for link in links:
                href = link.get_attribute("href")
                debug_log("🔗 href:", href)
                if is_linkedin_profile_url(href) and href not in [r["profileUrl"] for r in results]:
                    results.append({"profileUrl": clean_link(href)})
                    found += 1
                    if found >= 2:
                        break

            debug_log(f"✅ Keyword '{keyword}' → Found {found} profiles")

        except Exception as e:
            debug_log(f"❌ Error scraping for keyword '{keyword}':", str(e))
            time.sleep(2)

        if len(results) >= 5:
            break

    driver.quit()
    return results[:5]
