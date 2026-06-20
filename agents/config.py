import os
from dotenv import load_dotenv
from web3 import Web3

load_dotenv()

MONAD_RPC_URL = os.getenv("MONAD_RPC_URL", "https://testnet-rpc.monad.xyz")
CHAIN_ID = int(os.getenv("CHAIN_ID", "10143"))

w3 = Web3(Web3.HTTPProvider(MONAD_RPC_URL))

INVESTIGATION_TRAIL_ABI = [
    {
        "inputs": [{"name": "imageHash", "type": "string"}],
        "name": "createCase",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "caseId", "type": "uint256"},
            {"name": "domain", "type": "string"},
            {"name": "url", "type": "string"},
            {"name": "confidence", "type": "uint256"},
            {"name": "metadata", "type": "string"},
            {"name": "agentName", "type": "string"}
        ],
        "name": "submitFinding",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "caseId", "type": "uint256"},
            {"name": "platform", "type": "string"},
            {"name": "formatType", "type": "string"},
            {"name": "contact", "type": "string"},
            {"name": "subjectTemplate", "type": "string"},
            {"name": "bodyTemplate", "type": "string"},
            {"name": "agentName", "type": "string"}
        ],
        "name": "submitFormatSpec",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "caseId", "type": "uint256"},
            {"name": "platform", "type": "string"},
            {"name": "formatType", "type": "string"},
            {"name": "complaintData", "type": "string"},
            {"name": "agentName", "type": "string"}
        ],
        "name": "submitComplaint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"name": "caseId", "type": "uint256"}],
        "name": "getCaseFindings",
        "outputs": [{
            "components": [
                {"name": "agent", "type": "address"},
                {"name": "caseId", "type": "uint256"},
                {"name": "domain", "type": "string"},
                {"name": "url", "type": "string"},
                {"name": "confidence", "type": "uint256"},
                {"name": "timestamp", "type": "uint256"},
                {"name": "metadata", "type": "string"},
                {"name": "agentName", "type": "string"}
            ],
            "name": "",
            "type": "tuple[]"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"name": "caseId", "type": "uint256"}],
        "name": "getCaseFormatSpecs",
        "outputs": [{
            "components": [
                {"name": "agent", "type": "address"},
                {"name": "caseId", "type": "uint256"},
                {"name": "platform", "type": "string"},
                {"name": "formatType", "type": "string"},
                {"name": "contact", "type": "string"},
                {"name": "subjectTemplate", "type": "string"},
                {"name": "bodyTemplate", "type": "string"},
                {"name": "timestamp", "type": "uint256"},
                {"name": "agentName", "type": "string"}
            ],
            "name": "",
            "type": "tuple[]"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"name": "caseId", "type": "uint256"}],
        "name": "getCaseComplaints",
        "outputs": [{
            "components": [
                {"name": "agent", "type": "address"},
                {"name": "caseId", "type": "uint256"},
                {"name": "platform", "type": "string"},
                {"name": "formatType", "type": "string"},
                {"name": "complaintData", "type": "string"},
                {"name": "timestamp", "type": "uint256"},
                {"name": "agentName", "type": "string"}
            ],
            "name": "",
            "type": "tuple[]"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"name": "caseId", "type": "uint256"}],
        "name": "getCaseSummary",
        "outputs": [
            {"name": "owner", "type": "address"},
            {"name": "imageHash", "type": "string"},
            {"name": "timestamp", "type": "uint256"},
            {"name": "findingCount", "type": "uint256"},
            {"name": "formatCount", "type": "uint256"},
            {"name": "complaintCount", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

REPORT_REGISTRY_ABI = [
    {
        "inputs": [
            {"name": "caseId", "type": "uint256"},
            {"name": "reportHash", "type": "bytes32"},
            {"name": "agents", "type": "address[]"},
            {"name": "reportURI", "type": "string"},
            {"name": "summary", "type": "string"}
        ],
        "name": "storeReport",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"name": "caseId", "type": "uint256"}],
        "name": "verifyReport",
        "outputs": [
            {"name": "reportHash", "type": "bytes32"},
            {"name": "timestamp", "type": "uint256"},
            {"name": "coordinator", "type": "address"},
            {"name": "agents", "type": "address[]"},
            {"name": "reportURI", "type": "string"},
            {"name": "summary", "type": "string"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"name": "caseId", "type": "uint256"}],
        "name": "hasReport",
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    }
]
