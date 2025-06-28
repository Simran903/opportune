import time
from keybert import KeyBERT
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service


def extract_keywords(text):
    kw_model = KeyBERT()
    keywords = kw_model.extract_keywords(text, top_n=5)
    return [kw[0].lower() for kw in keywords]


def init_driver():
    options = Options()
    options.add_argument("--headless")  # Required in Docker/Render
    options.add_argument("--no-sandbox")  # Prevents sandbox issues
    options.add_argument("--disable-dev-shm-usage")  # Prevents crashes
    options.add_argument("--disable-gpu")
    options.add_argument("--disable-extensions")
    options.add_argument("--remote-debugging-port=9222")
    options.add_argument("--window-size=1280x800")
    options.add_argument(
        "user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    )

    return webdriver.Chrome(service=Service(), options=options)


def is_linkedin_profile_url(url):
    return (
        url
        and "linkedin.com/in/" in url
        and "google.com" not in url
        and "accounts.google.com" not in url
    )


def clean_link(url):
    return url.split("?")[0].split("&")[0]


def fetch_profiles(description):
    keywords = extract_keywords(description)
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
        query = f'site:linkedin.com/in "{search_keyword} developer" India'
        search_url = f"https://www.google.com/search?q={query}"

        try:
            driver.get(search_url)
            time.sleep(7)  # Wait for results to load

            links = driver.find_elements(By.CSS_SELECTOR, "a")
            found = 0
            for link in links:
                href = link.get_attribute("href")
                if is_linkedin_profile_url(href) and href not in [r["profileUrl"] for r in results]:
                    results.append({"profileUrl": clean_link(href)})
                    found += 1
                    if found >= 2:
                        break

        except Exception:
            time.sleep(2)  # Fallback wait on error

        if len(results) >= 5:
            break

    driver.quit()
    return results[:5]
