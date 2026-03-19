"""Work email enrichment service.

Finds work email addresses for contacts using name + company domain.
Used as a fallback after Clay enrichment for contacts still missing emails.

SETUP INSTRUCTIONS:
    This file is a template. Configure it with your email finding service.
    Any service that accepts (name + domain) and returns an email works.

    Popular options:
    - Hunter.io      — https://hunter.io/api
    - Dropcontact    — https://developer.dropcontact.com/
    - Snov.io        — https://snov.io/api
    - RocketReach    — https://rocketreach.co/api
    - Apollo         — Apollo's bulk_enrich already returns ~80-90% of emails

    Note: Clay already runs a multi-source waterfall (Apollo, Clearbit,
    Hunter, RocketReach). This enricher handles the remaining gaps.

    To configure:
    1. Set EMAIL_ENRICHMENT_API_KEY in your .env file
    2. Update _BASE and request format in _find_single_email() below
    3. Update response parsing to match your service's format
"""

import os
import time
import requests


class EmailEnricher:
    # =====================================================================
    # CONFIGURE YOUR EMAIL FINDING SERVICE HERE
    # =====================================================================
    _BASE = "https://api.your-email-service.com"

    def __init__(self):
        self.api_key = os.getenv("EMAIL_ENRICHMENT_API_KEY")
        if not self.api_key:
            raise ValueError("EMAIL_ENRICHMENT_API_KEY not found in environment")
        self.headers = {
            "Content-Type": "application/json",
            "x-api-key": self.api_key,  # Update auth header for your service
        }
        self.stats = {
            "total": 0,
            "found": 0,
            "not_found": 0,
            "errors": 0,
            "credits_used": 0,
        }

    def _find_single_email(self, full_name, company_domain):
        """Find work email for a single person.

        Returns email string or None if not found.
        CONFIGURE: Update URL, request body, and response parsing.
        """
        domain = company_domain.lower().strip()
        for prefix in ["https://", "http://", "www."]:
            if domain.startswith(prefix):
                domain = domain[len(prefix):]
        domain = domain.rstrip("/")

        try:
            resp = requests.post(
                f"{self._BASE}/api/v1/find/email_work",  # <-- Your endpoint
                headers=self.headers,
                json={
                    "full_name": full_name,       # <-- Your field names
                    "company_domain": domain,      # <-- Your field names
                },
                timeout=15,
            )

            if resp.status_code == 200:
                data = resp.json()
                email = data.get("email")  # <-- Your response field
                if email:
                    self.stats["credits_used"] += 1
                    return email
                return None
            elif resp.status_code == 404:
                return None
            elif resp.status_code == 429:
                time.sleep(2)
                return self._find_single_email(full_name, company_domain)
            else:
                self.stats["errors"] += 1
                return None

        except requests.RequestException:
            self.stats["errors"] += 1
            return None

    def find_work_emails(self, contacts):
        """Find work emails for a list of contacts.

        Args:
            contacts: List of dicts with 'full_name' and 'company_domain' keys.

        Returns:
            Same list with 'email' field added (None if not found).
        """
        self.stats = {"total": len(contacts), "found": 0, "not_found": 0, "errors": 0, "credits_used": 0}
        enriched = []

        for i, contact in enumerate(contacts):
            full_name = contact.get("full_name", "")
            if not full_name:
                first = contact.get("first_name", "")
                last = contact.get("last_name", "")
                full_name = f"{first} {last}".strip()

            domain = contact.get("company_domain", "") or contact.get("website", "")

            if not full_name or not domain:
                contact["email"] = None
                self.stats["not_found"] += 1
                enriched.append(contact)
                continue

            email = self._find_single_email(full_name, domain)
            contact["email"] = email

            if email:
                self.stats["found"] += 1
            else:
                self.stats["not_found"] += 1

            enriched.append(contact)

            if (i + 1) % 10 == 0 or (i + 1) == len(contacts):
                print(f"  Enriching emails... {self.stats['found']}/{i+1} found ({self.stats['found']/(i+1)*100:.1f}%)")

        return enriched

    def print_summary(self):
        """Print enrichment summary stats."""
        print(f"\n{'='*50}")
        print(f"EMAIL ENRICHMENT RESULTS")
        print(f"{'='*50}")
        print(f"Total contacts processed: {self.stats['total']}")
        print(f"Emails found: {self.stats['found']}")
        print(f"Not found: {self.stats['not_found']}")
        if self.stats["errors"] > 0:
            print(f"Errors: {self.stats['errors']}")
        print(f"Success rate: {self.stats['found']/max(self.stats['total'],1)*100:.1f}%")
        print(f"Credits used: {self.stats['credits_used']}")
        print(f"{'='*50}\n")
