import React, { useState } from "react";
import { UseStateManagement } from "@/StateManagement";
import { QRCodeSVG } from "qrcode.react";
import { IoCopySharp, IoCheckmarkSharp } from "react-icons/io5";
import toast from "react-hot-toast";

const Receive = () => {
  const { userAccount } = UseStateManagement();
  const [isCopied, setIsCopied] = useState(false);

  const copyFunction = () => {
    navigator.clipboard.writeText(userAccount);
    toast.success("Copied to clipboard!");
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="px-4 py-8 mx-auto ">
      <div className="bg-[#1A1A1A] rounded-2xl p-6 shadow-xl">
        <h1 className="mb-8 text-2xl font-bold text-center text-white">
          Receive Funds
        </h1>

        <div className="mb-8 space-y-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="wallet-address"
              className="block text-sm font-medium text-white/80"
            >
              Your Wallet Address
            </label>
          </div>
          <div className="flex gap-2">
            <input
              id="wallet-address"
              value={userAccount}
              readOnly
              className="block w-full px-4 py-3 font-mono text-sm bg-[#2B2B2B] rounded-xl text-white/90 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={copyFunction}
              className="flex items-center justify-center px-4 py-2 bg-[#2B2B2B] rounded-xl hover:bg-[#3B3B3B] transition-colors border border-gray-700"
            >
              {isCopied ? (
                <IoCheckmarkSharp className="w-5 h-5 text-white/80" />
              ) : (
                <IoCopySharp className="w-5 h-5 text-white/80" />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <div className="p-8 bg-white rounded-2xl">
            <QRCodeSVG value={userAccount} className="w-48 h-48" level="H" />
          </div>

          <p className="max-w-sm text-sm text-center text-white/60">
            Scan this QR code with your wallet app or copy the address above to
            receive funds
          </p>
        </div>
      </div>
    </div>
  );
};

export default Receive;
