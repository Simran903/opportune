import time
import requests
from keybert import KeyBERT
from bs4 import BeautifulSoup
import re
import os
from urllib.parse import quote_plus, urlparse, parse_qs, unquote
from dotenv import load_dotenv

load_dotenv()

DEBUG = False

SCRAPER_API_KEY = os.getenv("SCRAPER_API_KEY")
BACKEND_BASE_URL = os.getenv("BACKEND_BASE_URL").rstrip("/")

_kw_model = None

INDIA_SIGNALS = [
    "india", "bangalore", "bengaluru", "mumbai", "delhi", "new delhi",
    "hyderabad", "chennai", "pune", "kolkata", "gurgaon", "gurugram",
    "noida", "ahmedabad", "jaipur", "kochi", "indore", "chandigarh",
    "telangana", "karnataka", "maharashtra", "tamil nadu", "west bengal",
    "haryana", "uttar pradesh", "kerala", "rajasthan", "gujarat",
]

FOREIGN_SIGNALS = [
    "united states", "usa", "u.s.", "san francisco", "new york", "london",
    "united kingdom", " uk ", "california", "texas", "seattle", "austin",
    "toronto", "canada", "australia", "sydney", "germany", "berlin",
    "france", "paris", "netherlands", "ireland", "dublin", "singapore",
    "chicago", "boston", "los angeles", "washington dc", "atlanta",
    "denver", "miami", "philadelphia", "portland", "vancouver",
]


def debug_log(*args):
    if DEBUG:
        print(*args)


def extract_keywords(text: str, top_n: int = 5):
    """Extract keywords using KeyBERT."""
    global _kw_model
    if _kw_model is None:
        _kw_model = KeyBERT()
    keywords = _kw_model.extract_keywords(text, top_n=top_n)
    return [kw[0].lower() for kw in keywords]


def unwrap_google_url(url: str) -> str:
    """Unwrap Google redirect URLs to the target URL."""
    if not url:
        return url
    if url.startswith("/url?"):
        url = "https://www.google.com" + url
    if "/url?" in url:
        parsed = urlparse(url)
        qs = parse_qs(parsed.query)
        if "q" in qs:
            return unquote(qs["q"][0])
    return url


def extract_linkedin_slug(url: str) -> str | None:
    """Extract the LinkedIn profile slug from any URL variant."""
    url = unwrap_google_url(url)
    match = re.search(r"linkedin\.com/in/([^/?&#]+)", url, re.IGNORECASE)
    if match:
        return match.group(1).lower().rstrip("/")
    return None


def normalize_linkedin_url(url: str) -> str | None:
    """Canonicalize LinkedIn profile URLs so duplicates are caught reliably."""
    slug = extract_linkedin_slug(url)
    if slug:
        return f"https://www.linkedin.com/in/{slug}"
    return None


def is_linkedin_profile_url(url: str) -> bool:
    """Check if URL is a valid LinkedIn profile."""
    return normalize_linkedin_url(url) is not None


def is_likely_indian_profile(snippet: str, url: str) -> bool:
    """Filter profiles using Google snippet text and URL hints.

    Snippets from Google often omit location even for Indian profiles, so we
    reject only when foreign location signals are present and otherwise trust
    the India-biased search query.
    """
    text = f"{snippet} {url}".lower()

    if "in.linkedin.com" in text:
        return True

    for foreign in FOREIGN_SIGNALS:
        if foreign in text:
            return False

    for signal in INDIA_SIGNALS:
        if signal in text:
            return True

    # No location in snippet — trust the India-targeted Google query
    return True


def extract_snippet_for_link(link) -> str:
    """Walk up the DOM to find the Google result snippet near a profile link."""
    node = link
    for _ in range(8):
        if node is None:
            break
        classes = node.get("class") or []
        class_str = " ".join(classes) if isinstance(classes, list) else str(classes)
        if node.name == "div" and ("g " in f"{class_str} " or class_str == "g"):
            return node.get_text(" ", strip=True)
        node = node.parent

    parent = link.parent
    if parent:
        return parent.get_text(" ", strip=True)
    return ""


def extract_linkedin_profiles_from_html(html_content: str) -> list[dict]:
    """Extract LinkedIn profile URLs and nearby snippets from Google HTML."""
    soup = BeautifulSoup(html_content, "lxml")
    profiles: list[dict] = []
    seen_slugs: set[str] = set()

    for link in soup.find_all("a", href=True):
        href = unwrap_google_url(link["href"])
        normalized = normalize_linkedin_url(href)
        if not normalized:
            continue

        slug = extract_linkedin_slug(normalized)
        if not slug or slug in seen_slugs:
            continue

        snippet = extract_snippet_for_link(link)
        seen_slugs.add(slug)
        profiles.append({"profileUrl": normalized, "snippet": snippet})

    return profiles


def fetch_seen_profiles(employer_id: int, job_id: int | None = None) -> set[str]:
    """Fetch already seen LinkedIn profile URLs for an employer from backend."""
    try:
        url = f"{BACKEND_BASE_URL}/api/v1/job/employer/{employer_id}/seen-profiles"
        if job_id is not None:
            url += f"?jobId={job_id}"
        response = requests.get(url, timeout=10)

        if response.status_code == 200:
            raw = response.json().get("seenProfiles", [])
            normalized = set()
            for profile_url in raw:
                canonical = normalize_linkedin_url(profile_url)
                if canonical:
                    normalized.add(canonical)
            return normalized
        return set()
    except Exception as e:
        debug_log(f"Error fetching seen profiles: {str(e)}")
        return set()


def save_profiles(employer_id: int, job_id: int, profiles: list[dict]):
    """Send new profiles to backend to save in DB."""
    try:
        url = f"{BACKEND_BASE_URL}/api/v1/job/employer/{employer_id}/profiles"
        response = requests.post(
            url,
            json={"profiles": profiles, "jobId": job_id},
            timeout=10,
        )

        if response.status_code == 200:
            print(f"Saved {len(profiles)} profiles successfully")
            return True
        print(f"Failed to save profiles: {response.status_code}")
        return False
    except Exception as e:
        print(f"Error saving profiles: {str(e)}")
        return False


def build_india_search_query(keyword: str) -> str:
    """Build a Google query biased toward Indian LinkedIn profiles."""
    india_locations = (
        "India OR Bangalore OR Bengaluru OR Mumbai OR Delhi OR Hyderabad "
        "OR Chennai OR Pune OR Kolkata OR Gurgaon OR Gurugram OR Noida"
    )
    return (
        f'site:linkedin.com/in "{keyword}" developer ({india_locations}) '
        f'-USA -"United States" -London -"San Francisco" -Toronto -Sydney'
    )


def fetch_profiles(description: str, employer_id: int, job_id: int, limit: int = 20):
    """Scrape LinkedIn profiles from Google search results using ScraperAPI."""

    if not SCRAPER_API_KEY or SCRAPER_API_KEY == "YOUR_SCRAPERAPI_KEY_HERE":
        print("ERROR: Please set your ScraperAPI key in scraper.py")
        return []

    keywords = extract_keywords(description, top_n=3)
    debug_log("Extracted Keywords:", keywords)

    seen_profiles = fetch_seen_profiles(employer_id, job_id)
    debug_log(f"Already seen for job {job_id}: {len(seen_profiles)} profiles")

    results: list[dict] = []
    collected_slugs: set[str] = set()
    skipped_foreign = 0
    skipped_seen = 0

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
                query = build_india_search_query(search_keyword)
                search_url = (
                    f"https://www.google.com/search?q={quote_plus(query)}&start={start}"
                )

                debug_log(f"Searching: {search_url}")

                try:
                    api_url = (
                        f"http://api.scraperapi.com?api_key={SCRAPER_API_KEY}"
                        f"&url={quote_plus(search_url)}"
                    )
                    response = requests.get(api_url, timeout=60)

                    if response.status_code == 200:
                        profiles = extract_linkedin_profiles_from_html(response.text)

                        for profile in profiles:
                            url = profile["profileUrl"]
                            slug = extract_linkedin_slug(url)
                            snippet = profile.get("snippet", "")

                            if not slug or slug in collected_slugs:
                                continue
                            if url in seen_profiles:
                                skipped_seen += 1
                                continue
                            if not is_likely_indian_profile(snippet, url):
                                skipped_foreign += 1
                                debug_log(f"Skipped non-India profile: {url}")
                                continue

                            results.append({"profileUrl": url})
                            collected_slugs.add(slug)

                            if len(results) >= limit:
                                break
                    else:
                        if response.status_code == 401:
                            print("Invalid API key - check your ScraperAPI key")
                            return results
                        if response.status_code == 429:
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
    if skipped_foreign:
        print(f"Skipped {skipped_foreign} profiles with foreign location signals")
    if skipped_seen:
        print(f"Skipped {skipped_seen} already-seen profiles for this job")

    if results:
        save_profiles(employer_id, job_id, results)

    return results[:limit]
