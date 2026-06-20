import os
import json
import hashlib
from datetime import datetime
from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from agents import TelegramScanner, InstagramScanner, LeakDomainScanner, FormatDetector, TakedownPreparer
from base_agent import BaseAgent
from config import w3

load_dotenv()

app = FastAPI(title="Sniffer Agent Coordinator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TRAIL_ADDRESS = os.getenv("INVESTIGATION_TRAIL_ADDRESS", "")
REGISTRY_ADDRESS = os.getenv("REPORT_REGISTRY_ADDRESS", "")

AGENT_KEYS = {
    "telegram": os.getenv("AGENT_A_PRIVATE_KEY", ""),
    "instagram": os.getenv("AGENT_B_PRIVATE_KEY", ""),
    "leak_domains": os.getenv("AGENT_C_PRIVATE_KEY", ""),
    "format_detector": os.getenv("AGENT_D_PRIVATE_KEY", ""),
    "takedown_preparer": os.getenv("AGENT_E_PRIVATE_KEY", ""),
}

cases: Dict[int, Dict[str, Any]] = {}
agent_status: Dict[str, str] = {
    "Telegram Scanner": "idle",
    "Instagram Scanner": "idle",
    "Leak Domain Scanner": "idle",
    "Format Detector": "idle",
    "Takedown Preparer": "idle",
}
activity_log: List[Dict[str, Any]] = []


class InvestigateRequest(BaseModel):
    image_hash: str
    sources: List[str] = ["telegram", "instagram", "leak_domains"]


class CaseResponse(BaseModel):
    case_id: int
    image_hash: str
    status: str
    findings: List[Dict]
    format_specs: List[Dict]
    complaints: List[Dict]
    report_hash: str = None
    activity_log: List[Dict]


def log_activity(agent_name: str, action: str, details: str = ""):
    entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "agent": agent_name,
        "action": action,
        "details": details,
    }
    activity_log.append(entry)
    print(f"[LOG] {entry['timestamp']} | {agent_name} | {action} | {details}")


def get_agent(name: str, key: str) -> BaseAgent:
    agents = {
        "Telegram Scanner": TelegramScanner,
        "Instagram Scanner": InstagramScanner,
        "Leak Domain Scanner": LeakDomainScanner,
        "Format Detector": FormatDetector,
        "Takedown Preparer": TakedownPreparer,
    }
    return agents[name](key, TRAIL_ADDRESS, REGISTRY_ADDRESS)


@app.get("/health")
async def health():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}


@app.get("/agents/status")
async def get_agent_status():
    return agent_status


@app.get("/activity")
async def get_activity():
    return activity_log


@app.post("/investigate")
async def start_investigation(req: InvestigateRequest):
    coordinator_key = os.getenv("COORDINATOR_PRIVATE_KEY", "")
    if not coordinator_key:
        coordinator_key = AGENT_KEYS["format_detector"]

    coordinator = get_agent("Format Detector", coordinator_key)

    try:
        receipt = coordinator._build_and_send_tx(
            coordinator.trail_contract.functions.createCase(req.image_hash)
    )
        case_id = None
        for log in receipt.logs:
            try:
                decoded = coordinator.trail_contract.events.CaseCreated().process_log(log)
                case_id = decoded.args.caseId
                break
            except Exception:
                continue

        if case_id is None:
            raise Exception("Could not extract case ID from transaction")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create case on-chain: {str(e)}")

    cases[case_id] = {
        "image_hash": req.image_hash,
        "status": "investigating",
        "findings": [],
        "format_specs": [],
        "complaints": [],
        "report_hash": None,
        "agents_involved": [],
    }

    log_activity("Coordinator", "Case Created", f"Case #{case_id} created on-chain")

    all_findings = []
    agents_involved = []

    if "telegram" in req.sources:
        agent_status["Telegram Scanner"] = "scanning"
        log_activity("Telegram Scanner", "Started Scanning", "Scanning Telegram channels")
        agent = get_agent("Telegram Scanner", AGENT_KEYS["telegram"])
        findings = agent.scan(case_id, req.image_hash)
        all_findings.extend(findings)
        agents_involved.append(agent.address)
        agent_status["Telegram Scanner"] = "complete"
        log_activity("Telegram Scanner", "Scan Complete", f"Found {len(findings)} matches")

    if "instagram" in req.sources:
        agent_status["Instagram Scanner"] = "scanning"
        log_activity("Instagram Scanner", "Started Scanning", "Scanning Instagram")
        agent = get_agent("Instagram Scanner", AGENT_KEYS["instagram"])
        findings = agent.scan(case_id, req.image_hash)
        all_findings.extend(findings)
        agents_involved.append(agent.address)
        agent_status["Instagram Scanner"] = "complete"
        log_activity("Instagram Scanner", "Scan Complete", f"Found {len(findings)} matches")

    if "leak_domains" in req.sources:
        agent_status["Leak Domain Scanner"] = "scanning"
        log_activity("Leak Domain Scanner", "Started Scanning", "Scanning known leak domains")
        agent = get_agent("Leak Domain Scanner", AGENT_KEYS["leak_domains"])
        findings = agent.scan(case_id, req.image_hash)
        all_findings.extend(findings)
        agents_involved.append(agent.address)
        agent_status["Leak Domain Scanner"] = "complete"
        log_activity("Leak Domain Scanner", "Scan Complete", f"Found {len(findings)} matches")

    cases[case_id]["findings"] = all_findings

    if all_findings:
        agent_status["Format Detector"] = "detecting"
        log_activity("Format Detector", "Started Detection", "Detecting takedown formats")
        agent = get_agent("Format Detector", AGENT_KEYS["format_detector"])
        format_specs = agent.detect_formats(case_id, all_findings)
        cases[case_id]["format_specs"] = format_specs
        agent_status["Format Detector"] = "complete"
        log_activity("Format Detector", "Detection Complete", f"Found {len(format_specs)} formats")

        agent_status["Takedown Preparer"] = "preparing"
        log_activity("Takedown Preparer", "Started Preparation", "Preparing complaints")
        agent = get_agent("Takedown Preparer", AGENT_KEYS["takedown_preparer"])
        complaints = agent.prepare_complaints(case_id, all_findings, format_specs)
        cases[case_id]["complaints"] = complaints
        agent_status["Takedown Preparer"] = "complete"
        log_activity("Takedown Preparer", "Preparation Complete", f"Prepared {len(complaints)} complaints")

    report_data = json.dumps({
        "case_id": case_id,
        "image_hash": req.image_hash,
        "findings": all_findings,
        "format_specs": cases[case_id]["format_specs"],
        "complaints": cases[case_id]["complaints"],
        "timestamp": datetime.utcnow().isoformat(),
    }, sort_keys=True)
    report_hash = hashlib.sha256(report_data.encode()).digest()
    cases[case_id]["report_hash"] = "0x" + report_hash.hex()
    cases[case_id]["status"] = "complete"
    cases[case_id]["agents_involved"] = agents_involved

    log_activity("Coordinator", "Report Generated", f"Report hash: {cases[case_id]['report_hash']}")

    try:
        summary = f"Case #{case_id}: {len(all_findings)} findings, {len(cases[case_id]['format_specs'])} formats, {len(cases[case_id]['complaints'])} complaints"
        coordinator.store_report(
            case_id,
            report_hash,
            agents_involved,
            "",
            summary
        )
        log_activity("Coordinator", "Report Stored On-Chain", f"TX confirmed for case #{case_id}")
    except Exception as e:
        log_activity("Coordinator", "Report Storage Failed", str(e))

    return {
        "case_id": case_id,
        "status": "complete",
        "findings_count": len(all_findings),
        "format_specs_count": len(cases[case_id]["format_specs"]),
        "complaints_count": len(cases[case_id]["complaints"]),
        "report_hash": cases[case_id]["report_hash"],
    }


@app.get("/case/{case_id}")
async def get_case(case_id: int):
    if case_id not in cases:
        raise HTTPException(status_code=404, detail="Case not found")
    case = cases[case_id]
    return {
        "case_id": case_id,
        "image_hash": case["image_hash"],
        "status": case["status"],
        "findings": case["findings"],
        "format_specs": case["format_specs"],
        "complaints": case["complaints"],
        "report_hash": case["report_hash"],
        "activity_log": [log for log in activity_log],
    }


@app.get("/cases")
async def list_cases():
    return [
        {
            "case_id": cid,
            "image_hash": c["image_hash"],
            "status": c["status"],
            "findings_count": len(c["findings"]),
            "complaints_count": len(c["complaints"]),
            "report_hash": c["report_hash"],
        }
        for cid, c in cases.items()
    ]
