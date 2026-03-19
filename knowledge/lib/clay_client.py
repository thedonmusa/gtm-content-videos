"""Clay API client for company discovery and contact enrichment.

Clay is the data enrichment layer. It runs multi-source waterfalls
(Clearbit, Apollo, LinkedIn, Hunter, RocketReach, etc.) so you get
the best data without managing multiple API keys.

Docs: https://docs.clay.com
"""

import os
import csv
import time
import requests
from collections import Counter
from typing import Dict, List, Optional


class ClayClient:
    BASE_URL = "https://api.clay.com/v3"

    def __init__(self):
        self.api_key = os.getenv("CLAY_API_KEY")
        if not self.api_key:
            raise ValueError("CLAY_API_KEY not found in environment. Add it to your .env file.")
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
        }

    # ------------------------------------------------------------------
    # Company Discovery
    # ------------------------------------------------------------------

    def search_companies(
        self,
        keyword: str = None,
        employee_ranges: list = None,
        locations: list = None,
        industries: list = None,
        domains: list = None,
        max_results: int = 300,
    ) -> List[Dict]:
        """Search for companies using Clay's search endpoint.

        Returns basic company info. Call enrich_companies() after this
        to get full firmographic data via Clay's waterfall.

        Args:
            keyword: Industry or keyword filter (e.g., "saas", "fintech")
            employee_ranges: Employee ranges (e.g., ["51-200", "201-500"])
            locations: HQ locations (e.g., ["United States"])
            industries: Industry filters (e.g., ["Software", "FinTech"])
            domains: Specific domains to look up (skips keyword search)
            max_results: Max companies to return (default 300)

        Returns:
            List of company dicts with name, domain, basic info.
        """
        # If domains provided, convert to basic company list for enrichment
        if domains:
            companies = [{"name": "", "domain": d.strip()} for d in domains if d.strip()]
            print(f"  Using {len(companies)} provided domains for enrichment")
            return companies[:max_results]

        # Otherwise search Clay
        all_companies = []
        page = 1
        per_page = min(100, max_results)

        while len(all_companies) < max_results:
            body = {
                "page": page,
                "per_page": per_page,
            }
            if keyword:
                body["keyword"] = keyword
            if employee_ranges:
                body["employee_count_ranges"] = employee_ranges
            if locations:
                body["locations"] = locations
            if industries:
                body["industries"] = industries

            try:
                resp = requests.post(
                    f"{self.BASE_URL}/companies/search",
                    headers=self.headers,
                    json=body,
                    timeout=30,
                )
                resp.raise_for_status()
                data = resp.json()
            except requests.RequestException as e:
                print(f"  Error on page {page}: {e}")
                break

            companies = data.get("companies", data.get("results", []))
            if not companies:
                break

            for co in companies:
                domain = co.get("domain", "") or co.get("website", "")
                if domain:
                    domain = domain.replace("https://", "").replace("http://", "").rstrip("/")

                all_companies.append({
                    "clay_id": co.get("id", ""),
                    "name": co.get("name", ""),
                    "domain": domain,
                    "website": co.get("website", ""),
                    "industry": co.get("industry", ""),
                    "employee_count": co.get("employee_count", 0) or 0,
                    "annual_revenue": co.get("annual_revenue", ""),
                    "funding_stage": co.get("funding_stage", ""),
                    "total_funding": co.get("total_funding", ""),
                    "technologies": ", ".join(co.get("technologies", []) or []),
                    "city": co.get("city", ""),
                    "state": co.get("state", ""),
                    "country": co.get("country", ""),
                    "linkedin_url": co.get("linkedin_url", ""),
                    "founded_year": co.get("founded_year", ""),
                })

            if len(all_companies) >= max_results:
                break

            total = data.get("total", 0) or data.get("total_results", 0)
            if page * per_page >= total:
                break

            page += 1
            print(f"  Fetched page {page - 1}... ({len(all_companies)} companies so far)")
            time.sleep(0.3)

        all_companies = all_companies[:max_results]
        print(f"  Company search complete: {len(all_companies)} companies found")
        return all_companies

    def enrich_companies(self, companies: List[Dict]) -> List[Dict]:
        """Enrich companies via Clay's multi-source waterfall.

        Clay automatically tries Clearbit → Apollo → LinkedIn → Crunchbase
        to fill in funding, revenue, tech stack, and other firmographic data.

        Args:
            companies: List of company dicts with at least 'domain'

        Returns:
            List of fully enriched company dicts.
        """
        enriched = []
        total = len(companies)
        skipped = 0

        for i, co in enumerate(companies):
            domain = co.get("domain", "")
            if not domain:
                skipped += 1
                enriched.append(co)
                continue

            try:
                resp = requests.post(
                    f"{self.BASE_URL}/companies/enrich",
                    headers=self.headers,
                    json={"domain": domain},
                    timeout=30,
                )

                if resp.status_code == 200:
                    data = resp.json()
                    result = data.get("company", data)

                    if not result or not result.get("name"):
                        enriched.append(co)
                        continue

                    tech = result.get("technologies", []) or []
                    if isinstance(tech, list) and tech and isinstance(tech[0], dict):
                        tech = [t.get("name", "") for t in tech]

                    enriched_domain = result.get("domain", "") or domain
                    enriched_domain = enriched_domain.replace("https://", "").replace("http://", "").rstrip("/")

                    enriched.append({
                        "clay_id": result.get("id", "") or co.get("clay_id", ""),
                        "name": result.get("name", "") or co.get("name", ""),
                        "domain": enriched_domain,
                        "website": result.get("website", "") or co.get("website", ""),
                        "industry": result.get("industry", "") or co.get("industry", ""),
                        "employee_count": result.get("employee_count", 0) or co.get("employee_count", 0),
                        "annual_revenue": result.get("annual_revenue", "") or co.get("annual_revenue", ""),
                        "total_funding": result.get("total_funding", "") or co.get("total_funding", ""),
                        "funding_stage": result.get("funding_stage", "") or co.get("funding_stage", ""),
                        "funding_date": result.get("last_funding_date", "") or "",
                        "technologies": ", ".join(str(t) for t in tech[:20]),
                        "city": result.get("city", "") or co.get("city", ""),
                        "state": result.get("state", "") or co.get("state", ""),
                        "country": result.get("country", "") or co.get("country", ""),
                        "linkedin_url": result.get("linkedin_url", "") or co.get("linkedin_url", ""),
                        "founded_year": result.get("founded_year", "") or co.get("founded_year", ""),
                        "description": result.get("description", ""),
                    })

                elif resp.status_code == 429:
                    print(f"  Rate limited, waiting 2s...")
                    time.sleep(2)
                    enriched.append(co)
                else:
                    enriched.append(co)

            except requests.RequestException as e:
                print(f"  Warning: enrichment failed for {domain}: {e}")
                enriched.append(co)

            if (i + 1) % 10 == 0 or (i + 1) == total:
                print(f"  Enriching companies... {i + 1}/{total}")
            time.sleep(0.3)

        if skipped:
            print(f"  Skipped {skipped} companies with no domain")
        print(f"  Enrichment complete: {len(enriched)}/{total} companies processed")
        return enriched

    def save_companies_csv(self, companies: List[Dict], filepath: str = "outputs/companies.csv"):
        """Save company list to CSV."""
        if not companies:
            print("  No companies to save.")
            return

        fieldnames = [
            "name", "domain", "website", "industry", "employee_count",
            "annual_revenue", "total_funding", "funding_stage", "funding_date",
            "founded_year", "technologies", "city", "state", "country",
            "linkedin_url", "description", "clay_id",
        ]

        with open(filepath, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
            writer.writeheader()
            writer.writerows(companies)

        print(f"  Saved {len(companies)} companies to {filepath}")

    def get_company_summary(self, companies: List[Dict]) -> Dict:
        """Generate a summary of discovered companies."""
        industries = Counter()
        sizes = Counter()
        funding = Counter()

        for co in companies:
            ind = co.get("industry", "Unknown") or "Unknown"
            industries[ind] += 1

            emp = co.get("employee_count", 0) or 0
            if emp < 50:
                sizes["< 50"] += 1
            elif emp <= 100:
                sizes["50-100"] += 1
            elif emp <= 500:
                sizes["100-500"] += 1
            elif emp <= 1000:
                sizes["500-1,000"] += 1
            elif emp <= 5000:
                sizes["1,000-5,000"] += 1
            else:
                sizes["5,000+"] += 1

            stage = co.get("funding_stage", "Unknown") or "Unknown"
            funding[stage] += 1

        return {
            "total_count": len(companies),
            "industry_distribution": dict(industries.most_common(15)),
            "size_distribution": dict(sizes.most_common()),
            "funding_distribution": dict(funding.most_common()),
        }

    # ------------------------------------------------------------------
    # Contact Discovery
    # ------------------------------------------------------------------

    def search_contacts(
        self,
        domains: List[str],
        titles: List[str] = None,
        seniorities: List[str] = None,
        locations: List[str] = None,
        max_per_company: int = 5,
    ) -> List[Dict]:
        """Search for contacts at specified companies via Clay.

        NOTE: Search may return partial profiles. Always call
        enrich_contacts() after this to get verified emails and full info.

        Args:
            domains: Company domains to search (e.g., ["stripe.com", "notion.so"])
            titles: Job title filters (e.g., ["VP Sales", "Head of Sales"])
            seniorities: Seniority levels (e.g., ["vp", "director", "head"])
            locations: Person locations (e.g., ["United States"])
            max_per_company: Max contacts to return per company (default 5)

        Returns:
            List of person dicts with clay_id, name, title, company info
        """
        all_people = []

        for domain in domains:
            body = {
                "company_domain": domain,
                "max_results": max_per_company,
            }
            if titles:
                body["titles"] = titles
            if seniorities:
                body["seniorities"] = seniorities
            if locations:
                body["locations"] = locations

            try:
                resp = requests.post(
                    f"{self.BASE_URL}/people/search",
                    headers=self.headers,
                    json=body,
                    timeout=30,
                )
                resp.raise_for_status()
                data = resp.json()

                people = data.get("people", data.get("results", []))
                for person in people:
                    all_people.append({
                        "clay_id": person.get("id", ""),
                        "first_name": person.get("first_name", ""),
                        "last_name": person.get("last_name", ""),
                        "full_name": person.get("full_name", f"{person.get('first_name', '')} {person.get('last_name', '')}".strip()),
                        "title": person.get("title", ""),
                        "seniority": person.get("seniority", ""),
                        "linkedin_url": person.get("linkedin_url", ""),
                        "email": person.get("email", ""),
                        "company_name": person.get("company_name", ""),
                        "company_domain": domain,
                        "company_industry": person.get("company_industry", ""),
                    })

            except requests.RequestException as e:
                print(f"  Warning: contact search failed for {domain}: {e}")

            time.sleep(0.2)

        print(f"  Contact search complete: {len(all_people)} contacts found across {len(domains)} companies")
        return all_people

    def enrich_contacts(self, contacts: List[Dict]) -> List[Dict]:
        """Enrich contacts via Clay's waterfall to get verified emails and full profiles.

        Clay tries Apollo → Clearbit → Hunter → RocketReach → LinkedIn
        to find verified work emails and complete profile data.

        Args:
            contacts: List of contact dicts (from search_contacts or a CSV)
                      Each should have at least first_name + company_domain,
                      or clay_id, or linkedin_url.

        Returns:
            List of enriched contact dicts with verified emails and full info.
        """
        enriched = []
        total = len(contacts)

        for i, person in enumerate(contacts):
            # Build enrichment payload — Clay accepts multiple identifiers
            payload = {}
            if person.get("clay_id"):
                payload["clay_id"] = person["clay_id"]
            if person.get("linkedin_url"):
                payload["linkedin_url"] = person["linkedin_url"]
            if person.get("first_name") and person.get("company_domain"):
                payload["first_name"] = person["first_name"]
                payload["last_name"] = person.get("last_name", "")
                payload["company_domain"] = person["company_domain"]
            if person.get("email"):
                payload["email"] = person["email"]

            if not payload:
                enriched.append(person)
                continue

            try:
                resp = requests.post(
                    f"{self.BASE_URL}/people/enrich",
                    headers=self.headers,
                    json=payload,
                    timeout=30,
                )

                if resp.status_code == 200:
                    data = resp.json()
                    result = data.get("person", data)

                    if not result:
                        enriched.append(person)
                        continue

                    enriched.append({
                        "clay_id": result.get("id", "") or person.get("clay_id", ""),
                        "first_name": result.get("first_name", "") or person.get("first_name", ""),
                        "last_name": result.get("last_name", "") or person.get("last_name", ""),
                        "full_name": result.get("full_name", "") or person.get("full_name", ""),
                        "title": result.get("title", "") or person.get("title", ""),
                        "seniority": result.get("seniority", "") or person.get("seniority", ""),
                        "linkedin_url": result.get("linkedin_url", "") or person.get("linkedin_url", ""),
                        "email": result.get("email", "") or person.get("email", ""),
                        "email_status": result.get("email_status", ""),
                        "phone": result.get("phone", ""),
                        "company_name": result.get("company_name", "") or person.get("company_name", ""),
                        "company_domain": result.get("company_domain", "") or person.get("company_domain", ""),
                        "company_industry": result.get("company_industry", "") or person.get("company_industry", ""),
                        "city": result.get("city", ""),
                        "country": result.get("country", ""),
                    })

                elif resp.status_code == 429:
                    print(f"  Rate limited, waiting 2s...")
                    time.sleep(2)
                    enriched.append(person)
                else:
                    enriched.append(person)

            except requests.RequestException as e:
                print(f"  Warning: enrichment failed for {person.get('full_name', 'unknown')}: {e}")
                enriched.append(person)

            if (i + 1) % 10 == 0 or (i + 1) == total:
                print(f"  Enriching contacts... {i + 1}/{total}")
            time.sleep(0.3)

        print(f"  Contact enrichment complete: {len(enriched)}/{total} contacts processed")
        return enriched

    def save_contacts_csv(self, contacts: List[Dict], filepath: str = "outputs/contacts-enriched.csv"):
        """Save contacts to CSV."""
        if not contacts:
            print("  No contacts to save.")
            return

        fieldnames = [
            "first_name", "last_name", "full_name", "title", "seniority",
            "email", "email_status", "phone", "linkedin_url",
            "company_name", "company_domain", "company_industry",
            "city", "country", "clay_id",
        ]

        with open(filepath, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
            writer.writeheader()
            writer.writerows(contacts)

        print(f"  Saved {len(contacts)} contacts to {filepath}")

    def get_persona_breakdown(self, people: List[Dict]) -> Dict:
        """Generate persona breakdown from contact list."""
        titles = Counter()
        seniorities = Counter()
        companies = Counter()

        for person in people:
            title = person.get("title", "Unknown")
            title_lower = title.lower()
            if "vp" in title_lower or "vice president" in title_lower:
                titles["VP-level"] += 1
            elif "director" in title_lower:
                titles["Director-level"] += 1
            elif "head of" in title_lower:
                titles["Head of Department"] += 1
            elif "manager" in title_lower:
                titles["Manager-level"] += 1
            elif title_lower.startswith(("ceo", "cro", "cmo", "cfo", "coo", "chief")):
                titles["C-Suite"] += 1
            else:
                titles[title] += 1

            seniority = person.get("seniority", "unknown")
            seniorities[seniority] += 1

            company = person.get("company_name", "Unknown")
            companies[company] += 1

        return {
            "title_distribution": dict(titles.most_common(15)),
            "seniority_distribution": dict(seniorities.most_common()),
            "company_distribution": dict(companies.most_common(20)),
            "total_count": len(people),
            "companies_represented": len(companies),
        }

    def print_breakdown(self, breakdown: Dict):
        """Print a clean persona breakdown to stdout."""
        print(f"\n{'='*50}")
        print(f"CONTACT DISCOVERY RESULTS")
        print(f"{'='*50}")
        print(f"Total contacts found: {breakdown['total_count']}")
        print(f"Companies represented: {breakdown['companies_represented']}")

        print(f"\n--- Title Distribution ---")
        for title, count in breakdown["title_distribution"].items():
            pct = (count / breakdown["total_count"]) * 100
            print(f"  {title}: {count} ({pct:.1f}%)")

        print(f"\n--- Seniority Distribution ---")
        for seniority, count in breakdown["seniority_distribution"].items():
            pct = (count / breakdown["total_count"]) * 100
            print(f"  {seniority}: {count} ({pct:.1f}%)")

        print(f"\n--- Top Companies ---")
        for company, count in list(breakdown["company_distribution"].items())[:10]:
            print(f"  {company}: {count} contacts")

        print(f"{'='*50}\n")
