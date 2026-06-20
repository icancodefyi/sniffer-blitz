import os
import json
import hashlib
from datetime import datetime
from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import threading

from agents.agents import TelegramScanner, InstagramScanner, LeakDomainScanner, FormatDetector, TakedownPreparer
from agents.base_agent import BaseAgent
from agents.config import w3

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


def run_investigation(case_id: int, image_hash: str, sources: List[str]):
    """Run the full investigation in background"""
    try:
        all_findings = []
        agents_involved = []

        if "telegram" in sources:
            agent_status["Telegram Scanner"] = "scanning"
            log_activity("Telegram Scanner", "Started Scanning", "Scanning Telegram channels")
            agent = get_agent("Telegram Scanner", AGENT_KEYS["telegram"])
            findings = agent.scan(case_id, image_hash)
            all_findings.extend(findings)
            agents_involved.append(agent.address)
            agent_status["Telegram Scanner"] = "complete"
            log_activity("Telegram Scanner", "Scan Complete", f"Found {len(findings)} matches")

        if "instagram" in sources:
            agent_status["Instagram Scanner"] = "scanning"
            log_activity("Instagram Scanner", "Started Scanning", "Scanning Instagram")
            agent = get_agent("Instagram Scanner", AGENT_KEYS["instagram"])
            findings = agent.scan(case_id, image_hash)
            all_findings.extend(findings)
            agents_involved.append(agent.address)
            agent_status["Instagram Scanner"] = "complete"
            log_activity("Instagram Scanner", "Scan Complete", f"Found {len(findings)} matches")

        if "leak_domains" in sources:
            agent_status["Leak Domain Scanner"] = "scanning"
            log_activity("Leak Domain Scanner", "Started Scanning", "Scanning known leak domains")
            agent = get_agent("Leak Domain Scanner", AGENT_KEYS["leak_domains"])
            findings = agent.scan(case_id, image_hash)
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
            "image_hash": image_hash,
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
            coordinator_key = os.getenv("COORDINATOR_PRIVATE_KEY", "")
            if not coordinator_key:
                coordinator_key = AGENT_KEYS["format_detector"]
            coordinator = get_agent("Format Detector", coordinator_key)
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

    except Exception as e:
        log_activity("Coordinator", "Investigation Failed", str(e))
        cases[case_id]["status"] = "failed"


@app.post("/investigate")
async def start_investigation(req: InvestigateRequest, background_tasks: BackgroundTasks):
    coordinator_key = os.getenv("COORDINATOR_PRIVATE_KEY", "")
    if not coordinator_key:
        coordinator_key = AGENT_KEYS["format_detector"]

    coordinator = get_agent("Format Detector", coordinator_key)

    try:
        # Get current case count before creation
        case_count_before = coordinator.trail_contract.functions.caseCount().call()
        
        receipt = coordinator._build_and_send_tx(
            coordinator.trail_contract.functions.createCase(req.image_hash)
        )
        
        # Get case count after creation - the new case ID is the new count
        case_count_after = coordinator.trail_contract.functions.caseCount().call()
        
        if case_count_after > case_count_before:
            case_id = case_count_after
        else:
            raise Exception("Case was not created on-chain")

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

    # Run investigation in background
    background_tasks.add_task(run_investigation, case_id, req.image_hash, req.sources)

    return {
        "case_id": case_id,
        "status": "investigating",
        "message": "Investigation started. Agents are working."
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
