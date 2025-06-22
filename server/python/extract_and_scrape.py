import sys
import json
import time
import re
from keybert import KeyBERT
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options


def extract_keywords(text):
    kw_model = KeyBERT()
    keywords = kw_model.extract_keywords(text, top_n=5)
    return [kw[0].lower() for kw in keywords]


def init_driver():
    options = Options()
    options.add_argument("--headless")
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


def fetch_profiles_from_google(driver, keywords):
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

        success = False
        for attempt in range(2):
            try:
                driver.get(search_url)
                time.sleep(5)
                links = driver.find_elements(By.CSS_SELECTOR, "a")
                found = 0

                for link in links:
                    href = link.get_attribute("href")
                    if is_linkedin_profile_url(href) and href not in [r["profileUrl"] for r in results]:
                        results.append({
                            "profileUrl": clean_link(href)
                        })
                        found += 1
                        if found >= 2:
                            break

                print(f"Keyword '{keyword}' → Found {found} LinkedIn profiles", file=sys.stderr)
                success = found > 0
                break

            except Exception as e:
                print(f"Attempt {attempt + 1} failed for keyword '{keyword}': {e}", file=sys.stderr)
                time.sleep(2)

        if len(results) >= 5:
            break

    return results[:5]


def main():
    description = sys.stdin.read()
    keywords = extract_keywords(description)
    print("Extracted Keywords:", keywords, file=sys.stderr)

    driver = init_driver()
    profiles = fetch_profiles_from_google(driver, keywords)
    driver.quit()

    print(json.dumps(profiles, indent=2))


if __name__ == "__main__":
    main()
