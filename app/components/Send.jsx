import React, { useEffect, useState } from "react";
import { UseStateManagement } from "@/StateManagement/index";
import { CustomDropdown } from "./ui/dropdown";
import toast from "react-hot-toast";
import { FiCopy, FiCheck, FiExternalLink } from "react-icons/fi";
import Loading from "./Loading";

const options = [
  { label: "Ether transfer", value: "ether" },
  { label: "Token transfer", value: "token" },
  { label: "NFT transfer", value: "nft" },
  { label: "Batch transfer", value: "batch" },
];

const Send = () => {
  const {
    tokenDetails,
    getTokenBalance,
    userAccount,
    transferEther,
    transferTokens,
    transferNFT,
    loading,
    setLoading,
    sendTo,
    setSendTo,
    amount,
    setAmount,
    nftId,
    setNftId,
    tokenAddress,
    setTokenAddress,
    nftAddress,
    setNftAddress,
    inputFields,
    setInputFields,
    handleInputChange,
    handleAddInput,
    sendBatchTransaction,
  } = UseStateManagement();

  const [showTxModal, setShowTxModal] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [transferType, setTransferType] = useState("ether");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getTokenBalance();
  }, []);

  const handleEthTransfer = async () => {
    try {
      setIsLoading(true);
      const tx = await transferEther(sendTo, amount);

      if (tx) {
        setTxHash(`${tx}`);
        setShowTxModal(true);
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error("Transaction failed");
    } finally {
      setIsLoading(false);
      setSendTo("");
      setAmount("");
    }
  };

  const handleTokenTransfer = async () => {
    try {
      setLoading(true);
      await transferTokens(tokenAddress, sendTo, amount);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNftTransfer = async () => {
    try {
      setLoading(true);
      await transferNFT(nftAddress, sendTo, nftId);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchTransfer = async () => {
    try {
      setLoading(true);
      await sendBatchTransaction();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveInput = (indexToRemove) => {
    setInputFields(inputFields.filter((_, index) => index !== indexToRemove));
  };

  const handleTransferTypeChange = (e) => {
    setTransferType(e.target.value);
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Loading />
        </div>
      )}

      <div className="container max-w-5xl px-4 py-8 mx-auto">
        <div className="bg-[#1A1A1A] rounded-2xl p-6 shadow-xl">
          <div className="mb-8">
            <h2 className="mb-6 text-xl font-semibold">Send Assets</h2>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Transfer Type
                </label>
                <CustomDropdown
                  value={transferType}
                  onChange={handleTransferTypeChange}
                  options={options}
                />
              </div>

              {transferType === "ether" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Address</label>
                  <input
                    value={userAccount}
                    readOnly
                    className="w-full bg-[#2B2B2B] rounded-xl py-2.5 px-3.5 text-sm h-[52px]"
                  />
                </div>
              )}
              {transferType === "token" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Token Address
                  </label>
                  <input
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    className="w-full bg-[#2B2B2B] rounded-xl py-2.5 px-3.5 text-sm h-[52px]"
                  />
                </div>
              )}
              {transferType === "nft" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    NFT Address
                  </label>
                  <input
                    value={nftAddress}
                    onChange={(e) => setNftAddress(e.target.value)}
                    className="w-full bg-[#2B2B2B] rounded-xl py-2.5 px-3.5 text-sm h-[52px]"
                  />
                </div>
              )}
            </div>
          </div>

          {transferType === "batch" ? (
            <div className="space-y-6">
              {inputFields.map((input, index) => (
                <div key={index} className="relative">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">
                        Encoded Data
                      </label>
                      <input
                        value={input.value1}
                        onChange={(event) => handleInputChange(index, event)}
                        className="w-full bg-[#2B2B2B] rounded-xl py-2.5 px-3.5 text-sm h-[52px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">
                        Target Contract
                      </label>
                      <div className="flex gap-2">
                        <input
                          value={input.value2}
                          onChange={(event) => handleInputChange(index, event)}
                          className="w-full bg-[#2B2B2B] rounded-xl py-2.5 px-3.5 text-sm h-[52px]"
                        />
                        <button
                          onClick={() => handleRemoveInput(index)}
                          className="px-4 text-red-500 transition-colors bg-red-500/20 hover:bg-red-500/30 rounded-xl"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <button
                  onClick={handleAddInput}
                  className="bg-[#2B2B2B] px-4 py-2 rounded-xl hover:bg-[#3B3B3B] transition-colors"
                >
                  Add Batch
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Send To</label>
                <input
                  value={sendTo}
                  onChange={(e) => setSendTo(e.target.value)}
                  className="w-full bg-[#2B2B2B] rounded-xl py-2.5 px-3.5 text-sm h-[52px]"
                  placeholder="Enter recipient address"
                />
              </div>

              {(transferType === "ether" || transferType === "token") && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#2B2B2B] rounded-xl py-2.5 px-3.5 text-sm h-[52px]"
                    placeholder="Enter amount"
                  />
                </div>
              )}

              {transferType === "nft" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">NFT ID</label>
                  <input
                    type="number"
                    value={nftId}
                    onChange={(e) => setNftId(e.target.value)}
                    className="w-full bg-[#2B2B2B] rounded-xl py-2.5 px-3.5 text-sm h-[52px]"
                    placeholder="Enter NFT ID"
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex justify-center mt-8">
            <button
              disabled={loading}
              className="px-8 py-4 bg-[#2B2B2B] rounded-xl w-56 hover:bg-[#3B3B3B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={
                transferType === "ether"
                  ? handleEthTransfer
                  : transferType === "token"
                  ? handleTokenTransfer
                  : transferType === "nft"
                  ? handleNftTransfer
                  : handleBatchTransfer
              }
            >
              {loading ? "Processing..." : "Send"}
            </button>
          </div>
        </div>
      </div>

      <TxModal
        hash={txHash}
        isOpen={showTxModal}
        onClose={() => setShowTxModal(false)}
      />
    </>
  );
};

export default Send;

const TxModal = ({ hash, isOpen, onClose }) => {
  const copyHash = () => {
    navigator.clipboard.writeText(hash);
    toast.success("Hash copied to clipboard!");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[90%] max-w-md bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800 shadow-xl">
        <h3 className="mb-4 text-xl font-semibold text-white">
          Transaction Successful ✨
        </h3>

        <div className="bg-[#2B2B2B] rounded-xl p-4 mb-6">
          <p className="mb-2 text-sm text-gray-400">Transaction Hash:</p>
          <div className="flex items-center gap-2">
            <p className="flex-1 font-mono text-sm text-white truncate">
              {hash}
            </p>
            <button
              onClick={copyHash}
              className="p-2 hover:bg-[#3a3a3a] rounded-lg transition-all"
              aria-label="Copy hash"
            >
              <FiCopy className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#2B2B2B] hover:bg-[#3a3a3a] text-white transition-all"
          >
            Close
          </button>
          <a
            href={`https://basescan.org/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            View on BaseScan
            <FiExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
