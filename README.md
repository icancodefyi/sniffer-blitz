# Sniffer - Agent-Powered Investigation Platform

Autonomous AI agents investigate leaked content. Every step is recorded on-chain. Victims receive tamper-proof certificates for takedowns and legal action.

Built for **Monad Blitz Mumbai V3 - The Agent Economy**

## Overview

Sniffer deploys 5 specialized AI agents that autonomously:
1. **Scan** multiple platforms for leaked content (Telegram, Instagram, leak domains)
2. **Detect** takedown formats required by each platform
3. **Prepare** complaints in the correct format for each platform
4. **Record** every action on-chain for transparency and trust

All agent actions are immutably recorded on the Monad blockchain, creating a verifiable investigation trail.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                        │
│  Landing | Upload | Live Investigation | Report             │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              COORDINATOR (FastAPI :8000)                     │
│  Orchestrates agents, manages cases, generates reports      │
└─────────────────────────────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Agent A-C   │  │ Agent D     │  │ Agent E     │
│ Scanners    │  │ Format Det. │  │ Takedown    │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
       └────────────────┼────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              SMART CONTRACTS (Monad Testnet)                 │
│  InvestigationTrail.sol | ReportRegistry.sol                │
└─────────────────────────────────────────────────────────────┘
```

## Smart Contracts

### InvestigationTrail.sol
Tracks all agent actions on-chain:
- `createCase(imageHash)` - Create new investigation case
- `submitFinding(caseId, domain, url, confidence, metadata, agentName)` - Agent submits finding
- `submitFormatSpec(caseId, platform, formatType, contact, ...)` - Agent submits format spec
- `submitComplaint(caseId, platform, formatType, complaintData, agentName)` - Agent submits complaint

### ReportRegistry.sol
Stores final investigation reports:
- `storeReport(caseId, reportHash, agents, reportURI, summary)` - Store tamper-proof report
- `verifyReport(caseId)` - Verify report authenticity

**Deployed on Monad Testnet (Chain ID: 10143)**

## Agents

1. **Telegram Scanner** - Scans Telegram channels for leaked content
2. **Instagram Scanner** - Scans Instagram for leaked content
3. **Leak Domain Scanner** - Scans known leak domains (mydesi.ltd, fsiblog.pro, etc.)
4. **Format Detector** - Detects takedown formats required by each platform
5. **Takedown Preparer** - Prepares complaints in the correct format

Each agent has its own wallet and submits transactions to the blockchain.

## Tech Stack

- **Smart Contracts**: Solidity + Foundry (Monad Foundry)
- **Backend**: Python + FastAPI
- **Frontend**: Next.js 16 + React 19 + TypeScript + Tailwind CSS
- **Blockchain**: Monad Testnet
- **Animations**: Framer Motion

## Local Development

### Prerequisites
- Node.js 20+
- Python 3.11+
- Foundry (Monad Foundry)

### Setup

1. **Smart Contracts**
```bash
cd contracts
# Install dependencies (if needed)
forge build

# Deploy to Monad testnet (requires testnet MON tokens)
# Get testnet tokens: https://testnet.monad.xyz
forge create src/InvestigationTrail.sol:InvestigationTrail --private-key <YOUR_KEY> --rpc-url https://testnet-rpc.monad.xyz
forge create src/ReportRegistry.sol:ReportRegistry --private-key <YOUR_KEY> --rpc-url https://testnet-rpc.monad.xyz
```

2. **Coordinator Service**
```bash
cd services
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your contract addresses and agent keys
uvicorn coordinator:app --reload --port 8000
```

3. **Frontend**
```bash
cd web
npm install
npm run dev
```

Visit http://localhost:3000

## Demo Flow

1. **Landing Page** - Shows agent registry and live activity feed
2. **Upload** - Victim uploads leaked image, selects sources to scan
3. **Live Investigation** - Real-time visualization of agent pipeline
   - Watch agents scan in parallel
   - See findings appear on-chain
   - Watch format detection and complaint preparation
4. **Report** - Consolidated findings with on-chain proof
   - View all findings with confidence scores
   - View detected takedown formats
   - View prepared complaints (ready to send)
   - Verify report on-chain

## Why Blockchain?

- **Immutable Proof**: Every agent action is recorded on-chain, creating an auditable trail
- **Tamper-Proof Reports**: Report hashes stored on-chain prove authenticity
- **Transparency**: Anyone can verify the investigation was conducted correctly
- **Trust**: No central authority needed - the blockchain is the source of truth

## Hackathon Theme Alignment

This project embodies "The Agent Economy" by demonstrating:
- **Agent Identity**: Each agent has a unique wallet address
- **Agent Ownership**: Agents sign their own transactions
- **Agent Reputation**: On-chain track record of agent actions
- **Agent Coordination**: Agents work together autonomously
- **Agent Transactions**: Agents interact with smart contracts independently

## License

MIT
