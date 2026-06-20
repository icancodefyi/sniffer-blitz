from eth_account import Account
from config import w3, INVESTIGATION_TRAIL_ABI, REPORT_REGISTRY_ABI
import json
import time

class BaseAgent:
    def __init__(self, name: str, private_key: str, trail_address: str, registry_address: str):
        self.name = name
        self.account = Account.from_key(private_key)
        self.address = self.account.address
        self.trail_contract = w3.eth.contract(
            address=w3.to_checksum_address(trail_address),
            abi=INVESTIGATION_TRAIL_ABI
        )
        self.registry_contract = w3.eth.contract(
            address=w3.to_checksum_address(registry_address),
            abi=REPORT_REGISTRY_ABI
        )
        print(f"[{self.name}] Initialized with address: {self.address}")

    def _get_nonce(self):
        return w3.eth.get_transaction_count(self.address)

    def _build_and_send_tx(self, tx_func):
        tx = tx_func.build_transaction({
            'from': self.address,
            'nonce': self._get_nonce(),
            'gas': 500000,
            'gasPrice': w3.eth.gas_price,
            'chainId': 10143,
        })
        signed = self.account.sign_transaction(tx)
        tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        return receipt

    def submit_finding(self, case_id: int, domain: str, url: str, confidence: int, metadata: str):
        print(f"[{self.name}] Submitting finding: {domain} (confidence: {confidence}%)")
        receipt = self._build_and_send_tx(
            self.trail_contract.functions.submitFinding(
                case_id, domain, url, confidence, metadata, self.name
            )
        )
        print(f"[{self.name}] Finding submitted. TX: {receipt.transactionHash.hex()}")
        return receipt

    def submit_format_spec(self, case_id: int, platform: str, format_type: str, contact: str, subject_template: str, body_template: str):
        print(f"[{self.name}] Submitting format spec for {platform} ({format_type})")
        receipt = self._build_and_send_tx(
            self.trail_contract.functions.submitFormatSpec(
                case_id, platform, format_type, contact, subject_template, body_template, self.name
            )
        )
        print(f"[{self.name}] Format spec submitted. TX: {receipt.transactionHash.hex()}")
        return receipt

    def submit_complaint(self, case_id: int, platform: str, format_type: str, complaint_data: str):
        print(f"[{self.name}] Submitting complaint for {platform}")
        receipt = self._build_and_send_tx(
            self.trail_contract.functions.submitComplaint(
                case_id, platform, format_type, complaint_data, self.name
            )
        )
        print(f"[{self.name}] Complaint submitted. TX: {receipt.transactionHash.hex()}")
        return receipt

    def store_report(self, case_id: int, report_hash: bytes, agents: list, report_uri: str, summary: str):
        print(f"[{self.name}] Storing report for case {case_id}")
        receipt = self._build_and_send_tx(
            self.registry_contract.functions.storeReport(
                case_id, report_hash, agents, report_uri, summary
            )
        )
        print(f"[{self.name}] Report stored. TX: {receipt.transactionHash.hex()}")
        return receipt
