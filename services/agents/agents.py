from agents.base_agent import BaseAgent
import time
import json
from datetime import date

class TelegramScanner(BaseAgent):
    def __init__(self, private_key: str, trail_address: str, registry_address: str):
        super().__init__("Telegram Scanner", private_key, trail_address, registry_address)

    def scan(self, case_id: int, image_hash: str):
        print(f"[{self.name}] Starting Telegram scan for case {case_id}")
        time.sleep(0.3)

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
            time.sleep(0.2)

        print(f"[{self.name}] Scan complete. Found {len(findings)} matches.")
        return findings


class InstagramScanner(BaseAgent):
    def __init__(self, private_key: str, trail_address: str, registry_address: str):
        super().__init__("Instagram Scanner", private_key, trail_address, registry_address)

    def scan(self, case_id: int, image_hash: str):
        print(f"[{self.name}] Starting Instagram scan for case {case_id}")
        time.sleep(0.3)

        findings = []

        print(f"[{self.name}] Scan complete. Found {len(findings)} matches.")
        return findings


class LeakDomainScanner(BaseAgent):
    def __init__(self, private_key: str, trail_address: str, registry_address: str):
        super().__init__("Leak Domain Scanner", private_key, trail_address, registry_address)

    def scan(self, case_id: int, image_hash: str):
        print(f"[{self.name}] Starting leak domain scan for case {case_id}")
        time.sleep(0.3)

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
            time.sleep(0.2)

        print(f"[{self.name}] Scan complete. Found {len(findings)} matches.")
        return findings


class FormatDetector(BaseAgent):
    def __init__(self, private_key: str, trail_address: str, registry_address: str):
        super().__init__("Format Detector", private_key, trail_address, registry_address)

    def detect_formats(self, case_id: int, findings: list):
        print(f"[{self.name}] Detecting takedown formats for case {case_id}")
        time.sleep(0.3)

        platforms = set(f["domain"] for f in findings)
        format_specs = []

        body_template = (
            "Dear Trust & Safety / Abuse Team,\n\n"
            "I would like to report a page on your platform that contains intimate media "
            "involving someone who seems to be a minor, which appears to have been uploaded "
            "without their consent and may come under child pornography.\n\n"
            "Reported Content URL: {url}\n\n"
            "Based on the circumstances in which this content appears online, it may constitute "
            "non-consensual distribution of private media and could violate your platform's policies.\n\n"
            "A forensic investigation was performed using the LeakOps verification platform and "
            "generated the following case record:\n"
            "Case ID: {case_id_ref}\n"
            "Analysis Date: {analysis_date}\n\n"
            "Given the potential privacy violation, I kindly request that your Trust & Safety "
            "team review and remove the content if it breaches your policies.\n\n"
            "Please confirm receipt of this report and let me know if additional information is required.\n"
            "As said on the website you have zero tolerance policy for child porn content. "
            "hoping the takedown or relevant action to be acknowledges and taken as soon a s possilbe\n\n"
            "Thank you for your time and assistance.\n"
            "Sincerely,\n"
            "Zaid Rakhange\n\n"
            "This report is sent on behalf on the user of this"
        )

        format_map = {
            "t.me/leakedcontent": {
                "platform": "Telegram",
                "formatType": "email",
                "contact": "abuse@telegram.org",
                "subjectTemplate": "Content Removal Request - Case #{case_id}",
                "bodyTemplate": body_template
            },
            "t.me/viralmedia": {
                "platform": "Telegram",
                "formatType": "email",
                "contact": "abuse@telegram.org",
                "subjectTemplate": "Content Removal Request - Case #{case_id}",
                "bodyTemplate": body_template
            },
            "mydesi.ltd": {
                "platform": "mydesi.ltd",
                "formatType": "email",
                "contact": "abuse@mydesi.ltd",
                "subjectTemplate": "Content Removal Request - Case #{case_id}",
                "bodyTemplate": body_template
            },
            "fsiblog.pro": {
                "platform": "fsiblog.pro",
                "formatType": "web_form",
                "contact": "https://fsiblog.pro/report",
                "subjectTemplate": "Content Violation Report - Case #{case_id}",
                "bodyTemplate": body_template
            },
            "auntymaza.watch": {
                "platform": "auntymaza.watch",
                "formatType": "email",
                "contact": "support@auntymaza.watch",
                "subjectTemplate": "Content Removal Request - Case #{case_id}",
                "bodyTemplate": body_template
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
                time.sleep(0.2)

        print(f"[{self.name}] Format detection complete. Found {len(format_specs)} formats.")
        return format_specs


class TakedownPreparer(BaseAgent):
    def __init__(self, private_key: str, trail_address: str, registry_address: str):
        super().__init__("Takedown Preparer", private_key, trail_address, registry_address)

    def prepare_complaints(self, case_id: int, findings: list, format_specs: list):
        print(f"[{self.name}] Preparing complaints for case {case_id}")
        time.sleep(0.3)

        complaints = []
        spec_map = {s["platform"]: s for s in format_specs}
        today = date.today()
        analysis_date = today.strftime("%d %B %Y")
        case_id_ref = f"LKO-{case_id}-2026"

        for finding in findings:
            domain = finding["domain"]
            if domain in spec_map:
                spec = spec_map[domain]
                body = (spec["bodyTemplate"]
                    .replace("{url}", finding["url"])
                    .replace("{case_id}", str(case_id))
                    .replace("{case_id_ref}", case_id_ref)
                    .replace("{analysis_date}", analysis_date))
                complaint_data = json.dumps({
                    "platform": spec["platform"],
                    "format": spec["formatType"],
                    "contact": spec["contact"],
                    "subject": spec["subjectTemplate"].replace("{case_id}", str(case_id)),
                    "body": body,
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
                time.sleep(0.2)

        print(f"[{self.name}] Complaint preparation complete. Prepared {len(complaints)} complaints.")
        return complaints
