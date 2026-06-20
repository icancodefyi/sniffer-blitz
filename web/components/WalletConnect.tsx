"use client";

import { useState, useEffect, useCallback } from "react";
import { connectWallet, getBalance, payGasFee, listenAccountChange, COORDINATOR_ADDRESS, PAYMENT_AMOUNT } from "@/lib/wallet";
import { formatEther } from "viem";

export function WalletButton() {
  const [address, setAddress] = useState<`0x${string}` | null>(null);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("sniffer_wallet");
    if (stored) setAddress(stored as `0x${string}`);
  }, []);

  useEffect(() => {
    if (!address) return;
    getBalance(address).then(setBalance).catch(() => {});
    const interval = setInterval(() => getBalance(address).then(setBalance).catch(() => {}), 5000);
    return () => clearInterval(interval);
  }, [address]);

  useEffect(() => {
    return listenAccountChange((accounts) => {
      if (accounts.length === 0) {
        setAddress(null);
        sessionStorage.removeItem("sniffer_wallet");
      } else {
        setAddress(accounts[0] as `0x${string}`);
        sessionStorage.setItem("sniffer_wallet", accounts[0]);
      }
    });
  }, []);

  const handleConnect = useCallback(async () => {
    setConnecting(true);
    try {
      const addr = await connectWallet();
      setAddress(addr);
      sessionStorage.setItem("sniffer_wallet", addr);
    } catch (e) {
      console.error("Failed to connect wallet:", e);
    } finally {
      setConnecting(false);
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    setAddress(null);
    setBalance(null);
    sessionStorage.removeItem("sniffer_wallet");
    setShowMenu(false);
  }, []);

  if (address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#e8e4de] bg-white text-xs font-medium text-[#0a0a0a] hover:bg-[#fafaf9] transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="font-mono">{address.slice(0, 6)}...{address.slice(-4)}</span>
          {balance !== null && (
            <span className="text-[#a8a29e] font-mono">{Number(formatEther(balance)).toFixed(4)} MON</span>
          )}
        </button>
        {showMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border border-[#e8e4de] bg-white shadow-lg p-2">
              <div className="px-3 py-2 text-xs text-[#a8a29e] font-mono break-all">{address}</div>
              <hr className="border-[#e8e4de] my-1" />
              <button
                onClick={handleDisconnect}
                className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                Disconnect
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={connecting}
      className="px-4 py-1.5 bg-[#0a0a0a] text-white rounded-full text-xs font-medium hover:opacity-75 disabled:opacity-50 transition-opacity"
    >
      {connecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}

export function PayButton({ onPaid, disabled }: { onPaid: () => void; disabled: boolean }) {
  const [address, setAddress] = useState<`0x${string}` | null>(null);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("sniffer_wallet");
    if (stored) setAddress(stored as `0x${string}`);
  }, []);

  const handlePay = useCallback(async () => {
    if (!address) return;
    setPaying(true);
    setError(null);
    try {
      const hash = await payGasFee(address);
      setTxHash(hash);
      setPaid(true);
      onPaid();
    } catch (e: any) {
      setError(e.message || "Transaction rejected");
    } finally {
      setPaying(false);
    }
  }, [address, onPaid]);

  if (!address) {
    return (
      <p className="text-xs text-[#a8a29e] mt-2">Connect your wallet first to pay agent gas fees</p>
    );
  }

  if (paid) {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm mt-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Payment confirmed — {PAYMENT_AMOUNT} MON
        {txHash && (
          <a
            href={`https://testnet.monadexplorer.com/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-500 underline ml-1"
          >
            View tx
          </a>
        )}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handlePay}
        disabled={paying || disabled}
        className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {paying ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            Processing Payment...
          </>
        ) : (
          <>Pay {PAYMENT_AMOUNT} MON — Covers Agent Gas Fees</>
        )}
      </button>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
