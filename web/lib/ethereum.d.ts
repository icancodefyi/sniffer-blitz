interface Window {
  ethereum?: import("viem").EIP1193Provider & {
    on?: (event: string, cb: (...args: any[]) => void) => void;
    removeListener?: (event: string, cb: (...args: any[]) => void) => void;
  };
}
