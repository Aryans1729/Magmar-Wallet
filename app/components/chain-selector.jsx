import { useEffect, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { useChainId, useSwitchChain } from "wagmi";

export function ChainSelector() {
  const chainId = useChainId();
  const { chains, switchChain } = useSwitchChain();
  const [currChain, setCurrChain] = useState(chainId);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setCurrChain(chainId);
  }, [chainId]);

  useEffect(() => {
    const closeOnEscape = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const closeOnClickOutside = (e) => {
      if (isOpen && !e.target.closest("#chain-modal")) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("mousedown", closeOnClickOutside);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("mousedown", closeOnClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const currentChain = chains.find((chain) => chain.id === currChain);

  const handleChainSwitch = (selectedChainId) => {
    if (selectedChainId !== chainId) {
      switchChain({ chainId: selectedChainId });
    }
    setIsOpen(false);
  }; 

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="relative inline-block">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-gray-900 border border-gray-700 rounded-lg hover:bg-gray-700"
      >
        <span>{currentChain?.name}</span>
        <BiChevronDown className="w-4 h-4" />
      </button>

      {/* Modal Backdrop */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black bg-opacity-50" />}

      {/* Modal */}
      {isOpen && (
        <div
          id="chain-modal"
          className="fixed z-50 w-64 -translate-x-1/2 -translate-y-1/2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg left-1/2 top-1/2"
        >
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-medium text-white">Select Network</h2>
          </div>

          <div className="p-2 overflow-y-auto max-h-64">
            {chains.map((chain) => (
              <button
                key={chain.id}
                onClick={() => handleChainSwitch(chain.id)}
                className={`w-full px-4 py-3 text-left rounded-md transition-colors ${
                  chain.id === currChain
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <span className="flex items-center gap-3">{chain.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
