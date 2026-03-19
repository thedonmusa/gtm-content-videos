"""Instantly API v2 client for campaign creation and lead management."""

import os
import html
import requests


# Default campaign settings — customize for your sending preferences
DEFAULT_SETTINGS = {
    "email_gap": 15,
    "random_wait_max": 7,
    "text_only": True,
    "first_email_text_only": True,
    "daily_limit": 9999,
    "stop_on_reply": True,
    "match_lead_esp": True,
    "link_tracking": False,
    "open_tracking": False,
    "pl_value": 35000,
    "campaign_schedule": {
        "schedules": [
            {
                "name": "Weekday schedule",
                "timing": {"from": "08:00", "to": "14:00"},
                "days": {
                    "1": True,
                    "2": True,
                    "3": True,
                    "4": True,
                    "5": False,
                },
                "timezone": "America/New_York",
            }
        ]
    },
}


def to_instantly_html(plain_text: str) -> str:
    """Convert plain text email to Instantly HTML format."""
    lines = plain_text.strip().split("\n")
    result = []
    for line in lines:
        if line.strip() == "":
            result.append("<div><br /></div>")
        else:
            result.append(f"<div>{html.escape(line.strip())}</div>")
    return "".join(result)


class InstantlyClient:
    BASE_URL = "https://api.instantly.ai/api/v2"

    def __init__(self):
        self.api_key = os.getenv("INSTANTLY_API_KEY")
        if not self.api_key:
            raise ValueError("INSTANTLY_API_KEY not found in environment")
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
        }

    def create_campaign(self, name, sequences, settings=None):
        """Create a new campaign in DRAFT mode.

        Args:
            name: Campaign name
            sequences: List of sequence step dicts. Each step has:
                - delay: int (days)
                - variants: list of {subject: str, body: str} (plain text)
            settings: Optional overrides for default settings

        Returns:
            Campaign object with id, name, status
        """
        steps = []
        for step in sequences:
            variants = []
            for variant in step.get("variants", []):
                variants.append({
                    "subject": variant["subject"],
                    "body": to_instantly_html(variant["body"]),
                })
            steps.append({
                "type": "email",
                "delay": step.get("delay", 2),
                "variants": variants,
                "delay_unit": "days",
                "pre_delay_unit": "days",
            })

        campaign_settings = {**DEFAULT_SETTINGS}
        if settings:
            campaign_settings.update(settings)

        body = {
            "name": name,
            "sequences": [{"steps": steps}],
            **campaign_settings,
        }

        resp = requests.post(f"{self.BASE_URL}/campaigns", headers=self.headers, json=body)
        resp.raise_for_status()
        campaign = resp.json()

        print(f'  Campaign created: "{name}" (draft mode)')
        print(f"  Steps: {len(steps)} | Variants: {sum(len(s['variants']) for s in steps)}")
        return campaign

    def add_leads(self, campaign_id: str, leads: list, skip_if_in_campaign: bool = False) -> dict:
        """Add leads to a campaign.

        Args:
            campaign_id: Campaign UUID
            leads: List of lead dicts with at minimum: email (required),
                   first_name, last_name, company_name (recommended)
            skip_if_in_campaign: Skip leads already in other campaigns

        Returns:
            Summary dict with counts
        """
        added = 0
        failed = 0

        for i, lead in enumerate(leads):
            body = {
                "campaign": campaign_id,
                "skip_if_in_campaign": skip_if_in_campaign,
                "email": lead["email"],
            }
            for field in ["first_name", "last_name", "company_name", "website", "phone", "personalization"]:
                if lead.get(field):
                    body[field] = lead[field]

            try:
                resp = requests.post(f"{self.BASE_URL}/leads", headers=self.headers, json=body)
                if resp.status_code in (200, 201):
                    added += 1
                else:
                    failed += 1
            except requests.RequestException:
                failed += 1

            if (i + 1) % 25 == 0 or (i + 1) == len(leads):
                print(f"  Loading leads... {added}/{i+1} added")

        print(f"\n  Lead loading complete: {added} added, {failed} failed out of {len(leads)} total")
        return {"added": added, "failed": failed, "total": len(leads)}

    def get_campaign(self, campaign_id: str) -> dict:
        resp = requests.get(f"{self.BASE_URL}/campaigns/{campaign_id}", headers=self.headers)
        resp.raise_for_status()
        return resp.json()

    def activate_campaign(self, campaign_id: str) -> dict:
        """Activate a campaign. ONLY call when explicitly requested."""
        resp = requests.post(f"{self.BASE_URL}/campaigns/{campaign_id}/activate", headers=self.headers, json={})
        resp.raise_for_status()
        print("  Campaign activated.")
        return resp.json()
