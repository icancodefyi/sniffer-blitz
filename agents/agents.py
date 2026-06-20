from base_agent import BaseAgent
import time
import json

class TelegramScanner(BaseAgent):
    def __init__(self, private_key: str, trail_address: str, registry_address: str):
        super().__init__("Telegram Scanner", private_key, trail_address, registry_address)

    def scan(self, case_id: int, image_hash: str):
        print(f"[{self.name}] Starting Telegram scan for case {case_id}")
        time.sleep(1)

        findings = [
            {
                "domain": "t.me/leakedcontent",
                "url": "https://t.me/leakedcontent/1234",
                "confidence": 94,
                "metadata": json.dumps({
                    "match_type": "exact",
                    "hash_distance": 3,
                    "ssim": 0.96,
                    "channel_subscribers": 15000
                })
            },
            {
                "domain": "t.me/viralmedia",
                "url": "https://t.me/viralmedia/5678",
                "confidence": 87,
                "metadata": json.dumps({
                    "match_type": "near_duplicate",
                    "hash_distance": 8,
                    "ssim": 0.89,
                    "channel_subscribers": 8500
                })
            }
        ]

        for finding in findings:
            self.submit_finding(
                case_id,
                finding["domain"],
                finding["url"],
                finding["confidence"],
                finding["metadata"]
            )
            time.sleep(0.5)

        print(f"[{self.name}] Scan complete. Found {len(findings)} matches.")
        return findings


class InstagramScanner(BaseAgent):
    def __init__(self, private_key: str, trail_address: str, registry_address: str):
        super().__init__("Instagram Scanner", private_key, trail_address, registry_address)

    def scan(self, case_id: int, image_hash: str):
        print(f"[{self.name}] Starting Instagram scan for case {case_id}")
        time.sleep(1)

        findings = []

        print(f"[{self.name}] Scan complete. Found {len(findings)} matches.")
        return findings


class LeakDomainScanner(BaseAgent):
    def __init__(self, private_key: str, trail_address: str, registry_address: str):
        super().__init__("Leak Domain Scanner", private_key, trail_address, registry_address)

    def scan(self, case_id: int, image_hash: str):
        print(f"[{self.name}] Starting leak domain scan for case {case_id}")
        time.sleep(1)

        findings = [
            {
                "domain": "mydesi.ltd",
                "url": "https://mydesi.ltd/video/12345",
                "confidence": 92,
                "metadata": json.dumps({
                    "match_type": "exact",
                    "hash_distance": 4,
                    "ssim": 0.94,
                    "network": "LTDNetwork",
                    "cdn": "ltdcdn.net"
                })
            },
            {
                "domain": "fsiblog.pro",
                "url": "https://fsiblog.pro/clip/67890",
                "confidence": 88,
                "metadata": json.dumps({
                    "match_type": "near_duplicate",
                    "hash_distance": 7,
                    "ssim": 0.87,
                    "network": "IndianPornEmpire",
                    "cdn": "ttcache.com"
                })
            },
            {
                "domain": "auntymaza.watch",
                "url": "https://auntymaza.watch/video/abc123",
                "confidence": 79,
                "metadata": json.dumps({
                    "match_type": "probable",
                    "hash_distance": 11,
                    "ssim": 0.72,
                    "network": "UnknownNetwork",
                    "cdn": "self_hosted"
                })
            }
        ]

        for finding in findings:
            self.submit_finding(
                case_id,
                finding["domain"],
                finding["url"],
                finding["confidence"],
                finding["metadata"]
            )
            time.sleep(0.5)

        print(f"[{self.name}] Scan complete. Found {len(findings)} matches.")
        return findings


class FormatDetector(BaseAgent):
    def __init__(self, private_key: str, trail_address: str, registry_address: str):
        super().__init__("Format Detector", private_key, trail_address, registry_address)

    def detect_formats(self, case_id: int, findings: list):
        print(f"[{self.name}] Detecting takedown formats for case {case_id}")
        time.sleep(1)

        platforms = set(f["domain"] for f in findings)
        format_specs = []

        format_map = {
            "t.me/leakedcontent": {
                "platform": "Telegram",
                "formatType": "email",
                "contact": "abuse@telegram.org",
                "subjectTemplate": "DMCA Takedown Request - Case #{case_id}",
                "bodyTemplate": "I am writing to request the immediate removal of the following content from Telegram which infringes my copyright and was shared without consent.\n\nContent URL: {url}\nCase ID: {case_id}\n\nI certify under penalty of perjury that this is accurate.\n\nSincerely,\nThe victim"
            },
            "t.me/viralmedia": {
                "platform": "Telegram",
                "formatType": "email",
                "contact": "abuse@telegram.org",
                "subjectTemplate": "Content Removal Request - Case #{case_id}",
                "bodyTemplate": "I request the removal of non-consensual intimate content shared on your platform.\n\nContent URL: {url}\nCase ID: {case_id}\n\nThis content was shared without my consent.\n\nSincerely,\nThe victim"
            },
            "mydesi.ltd": {
                "platform": "mydesi.ltd",
                "formatType": "email",
                "contact": "abuse@mydesi.ltd",
                "subjectTemplate": "DMCA Takedown Notice - Case #{case_id}",
                "bodyTemplate": "To whom it may concern,\n\nI hereby notify you that the following content hosted on your platform infringes my copyright and was distributed without authorization.\n\nContent URL: {url}\nCase ID: {case_id}\n\nI demand immediate removal.\n\nSincerely,\nThe victim"
            },
            "fsiblog.pro": {
                "platform": "fsiblog.pro",
                "formatType": "web_form",
                "contact": "https://fsiblog.pro/report",
                "subjectTemplate": "Content Violation Report",
                "bodyTemplate": "URL: {url}\nReason: Non-consensual content distribution\nCase ID: {case_id}\n\nPlease remove this content immediately."
            },
            "auntymaza.watch": {
                "platform": "auntymaza.watch",
                "formatType": "email",
                "contact": "support@auntymaza.watch",
                "subjectTemplate": "Urgent: Content Removal Request - Case #{case_id}",
                "bodyTemplate": "This is an urgent request to remove content that violates privacy laws.\n\nContent URL: {url}\nCase ID: {case_id}\n\nRemove immediately or face legal action.\n\nSincerely,\nThe victim"
            }
        }

        for platform in platforms:
            if platform in format_map:
                spec = format_map[platform]
                self.submit_format_spec(
                    case_id,
                    spec["platform"],
                    spec["formatType"],
                    spec["contact"],
                    spec["subjectTemplate"],
                    spec["bodyTemplate"]
                )
                format_specs.append(spec)
                time.sleep(0.5)

        print(f"[{self.name}] Format detection complete. Found {len(format_specs)} formats.")
        return format_specs


class TakedownPreparer(BaseAgent):
    def __init__(self, private_key: str, trail_address: str, registry_address: str):
        super().__init__("Takedown Preparer", private_key, trail_address, registry_address)

    def prepare_complaints(self, case_id: int, findings: list, format_specs: list):
        print(f"[{self.name}] Preparing complaints for case {case_id}")
        time.sleep(1)

        complaints = []
        spec_map = {s["platform"]: s for s in format_specs}

        for finding in findings:
            domain = finding["domain"]
            if domain in spec_map:
                spec = spec_map[domain]
                complaint_data = json.dumps({
                    "platform": spec["platform"],
                    "format": spec["formatType"],
                    "contact": spec["contact"],
                    "subject": spec["subjectTemplate"].replace("{case_id}", str(case_id)),
                    "body": spec["bodyTemplate"].replace("{url}", finding["url"]).replace("{case_id}", str(case_id)),
                    "evidence_urls": [finding["url"]],
                    "confidence": finding["confidence"],
                    "status": "ready_to_send"
                })

                self.submit_complaint(
                    case_id,
                    spec["platform"],
                    spec["formatType"],
                    complaint_data
                )
                complaints.append(json.loads(complaint_data))
                time.sleep(0.5)

        print(f"[{self.name}] Complaint preparation complete. Prepared {len(complaints)} complaints.")
        return complaints
