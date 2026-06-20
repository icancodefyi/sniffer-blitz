import { createWalletClient, custom, parseEther } from "viem";
import { monadTestnet } from "viem/chains";

export const COORDINATOR_ADDRESS = "0x15d0B0720453afe9d03831996276A44e8b202dDD";
export const PAYMENT_AMOUNT = "0.005";

export async function connectWallet(): Promise<`0x${string}`> {
  if (!window.ethereum) throw new Error("MetaMask not installed");
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  return (accounts as string[])[0] as `0x${string}`;
}

export async function getBalance(address: `0x${string}`): Promise<bigint> {
  if (!window.ethereum) throw new Error("MetaMask not installed");
  const result = await window.ethereum.request({ method: "eth_getBalance", params: [address, "latest"] });
  return BigInt(result as string);
}

export async function payGasFee(from: `0x${string}`): Promise<`0x${string}`> {
  const walletClient = createWalletClient({
    chain: monadTestnet,
    transport: custom(window.ethereum!),
  });

  const hash = await walletClient.sendTransaction({
    account: from,
    to: COORDINATOR_ADDRESS,
    value: parseEther(PAYMENT_AMOUNT),
  });

  return hash;
}

export function listenAccountChange(cb: (accounts: string[]) => void) {
  if (!window.ethereum) return;
  window.ethereum.on("accountsChanged", cb);
  return () => window.ethereum?.removeListener("accountsChanged", cb);
}
