"use client";

import { useAccount, useConnect, useDisconnect, useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import { COORDINATOR_ADDRESS, PAYMENT_AMOUNT } from "@/lib/wagmi";
import { useState } from "react";

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [showMenu, setShowMenu] = useState(false);

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#e8e4de] bg-white text-xs font-medium text-[#0a0a0a] hover:bg-[#fafaf9] transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="font-mono">{address.slice(0, 6)}...{address.slice(-4)}</span>
        </button>
        {showMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border border-[#e8e4de] bg-white shadow-lg p-2">
              <div className="px-3 py-2 text-xs text-[#a8a29e] font-mono break-all">{address}</div>
              <hr className="border-[#e8e4de] my-1" />
              <button
                onClick={() => { disconnect(); setShowMenu(false); }}
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
      onClick={() => connect({ connector: connectors[0] })}
      className="px-4 py-1.5 bg-[#0a0a0a] text-white rounded-full text-xs font-medium hover:opacity-75 transition-opacity"
    >
      Connect Wallet
    </button>
  );
}

export function PayButton({ onPaid, disabled }: { onPaid: () => void; disabled: boolean }) {
  const { address, isConnected } = useAccount();
  const { sendTransaction, isPending, isSuccess } = useSendTransaction();
  const [paid, setPaid] = useState(false);

  const handlePay = () => {
    sendTransaction({
      to: COORDINATOR_ADDRESS,
      value: parseEther(PAYMENT_AMOUNT),
    }, {
      onSuccess: () => {
        setPaid(true);
        onPaid();
      },
    });
  };

  if (!isConnected) {
    return (
      <p className="text-xs text-[#a8a29e] mt-2">Connect your wallet to pay agent gas fees</p>
    );
  }

  if (paid || isSuccess) {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm mt-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Payment confirmed — {PAYMENT_AMOUNT} MON
      </div>
    );
  }

  return (
    <button
      onClick={handlePay}
      disabled={isPending || disabled}
      className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
    >
      {isPending ? (
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
  );
}
