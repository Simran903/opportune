import time
import requests
from keybert import KeyBERT
from bs4 import BeautifulSoup
import re
import os
from dotenv import load_dotenv

load_dotenv()

DEBUG = False

SCRAPER_API_KEY = os.getenv("SCRAPER_API_KEY")

def debug_log(*args):
    if DEBUG:
        print(*args)


def extract_keywords(text: str, top_n: int = 5):
    """Extract keywords using KeyBERT."""
    kw_model = KeyBERT()
    keywords = kw_model.extract_keywords(text, top_n=top_n)
    return [kw[0].lower() for kw in keywords]


def is_linkedin_profile_url(url: str) -> bool:
    """Check if URL is a valid LinkedIn profile."""
    return (
        url
        and "linkedin.com/in/" in url
        and "google.com" not in url
        and "accounts.google.com" not in url
        and "/signup" not in url
        and "/login" not in url
    )


def clean_link(url: str) -> str:
    """Clean URL by removing query parameters."""
    url = url.split("?")[0].split("&")[0]
    url = url.rstrip("/")
    return url


def extract_linkedin_urls_from_html(html_content: str) -> list:
    """Extract LinkedIn profile URLs from HTML content."""
    soup = BeautifulSoup(html_content, 'lxml')
    urls = []
    
    for link in soup.find_all('a', href=True):
        href = link['href']
        
        if is_linkedin_profile_url(href):
            clean_url = clean_link(href)
            if clean_url not in urls:
                urls.append(clean_url)
        
        elif 'linkedin.com/in/' in href:
            match = re.search(r'(https?://[^/]*linkedin\.com/in/[^/&?]+)', href)
            if match:
                clean_url = clean_link(match.group(1))
                if clean_url not in urls:
                    urls.append(clean_url)
    
    return urls


def fetch_seen_profiles(employer_id: int):
    """Fetch already seen LinkedIn profile URLs for an employer from backend."""
    try:
        url = f"http://localhost:5000/api/v1/job/employer/{employer_id}/seen-profiles"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            seen = set(response.json().get("seenProfiles", []))
            return seen
        else:
            return set()
    except Exception as e:
        debug_log(f"Error fetching seen profiles: {str(e)}")
        return set()


def save_profiles(employer_id: int, profiles: list[dict]):
    """Send new profiles to backend to save in DB."""
    try:
        url = f"http://localhost:5000/api/v1/job/employer/{employer_id}/profiles"
        response = requests.post(
            url,
            json={"profiles": profiles},
            timeout=10
        )
        
        if response.status_code == 200:
            print(f"Saved {len(profiles)} profiles successfully")
            return True
        else:
            print(f"Failed to save profiles: {response.status_code}")
            return False
    except Exception as e:
        print(f"Error saving profiles: {str(e)}")
        return False


def fetch_profiles(description: str, employer_id: int, limit: int = 20):
    """Scrape LinkedIn profiles from Google search results using ScraperAPI."""
    
    if SCRAPER_API_KEY == "YOUR_SCRAPERAPI_KEY_HERE":
        print("ERROR: Please set your ScraperAPI key in scraper.py")
        return []
    
    keywords = extract_keywords(description, top_n=3)
    debug_log("Extracted Keywords:", keywords)

    seen_profiles = fetch_seen_profiles(employer_id)
    debug_log(f"Already seen: {len(seen_profiles)} profiles")

    results = []
    collected = set()

    fallback_keywords = {
        "rxjs": "angular",
        "ngrx": "angular",
        "typescript": "frontend",
        "javascript": "frontend",
        "js": "javascript",
    }

    try:
        for keyword in keywords:
            if len(results) >= limit:
                break
                
            search_keyword = fallback_keywords.get(keyword, keyword)

            for page in range(0, 2):
                if len(results) >= limit:
                    break
                    
                start = page * 10
                query = f'site:linkedin.com/in "{search_keyword} developer" India'
                search_url = f"https://www.google.com/search?q={query}&start={start}"

                debug_log(f"Searching: {search_url}")

                try:
                    api_url = f"http://api.scraperapi.com?api_key={SCRAPER_API_KEY}&url={search_url}"
                    response = requests.get(api_url, timeout=60)
                    
                    if response.status_code == 200:
                        linkedin_urls = extract_linkedin_urls_from_html(response.text)
                        
                        for url in linkedin_urls:
                            if url not in seen_profiles and url not in collected:
                                results.append({"profileUrl": url})
                                collected.add(url)
                                
                                if len(results) >= limit:
                                    break
                    else:
                        if response.status_code == 401:
                            print("Invalid API key - check your ScraperAPI key")
                            return results
                        elif response.status_code == 429:
                            debug_log("Rate limit reached - waiting 60 seconds")
                            time.sleep(60)
                    
                    time.sleep(2)
                    
                except requests.exceptions.Timeout:
                    debug_log(f"Request timeout for page {page + 1}")
                except Exception as e:
                    debug_log(f"Error scraping page {page + 1}:", str(e))

            time.sleep(3)

    except Exception as e:
        print(f"Fatal error in fetch_profiles: {str(e)}")

    print(f"Total profiles collected: {len(results)}")

    if results:
        save_profiles(employer_id, results)

    return results[:limit]