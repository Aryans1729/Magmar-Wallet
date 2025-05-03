"use client";

import { CovalentClient } from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";

import c1 from "@/app/assets/images/coin1.png"; // Bitcoin
import c2 from "@/app/assets/images/coin2.png"; // Ethereum
import c3 from "@/app/assets/images/coin3.png"; // Binance Coin
import c4 from "@/app/assets/images/coin4.png"; // Ripple
import c5 from "@/app/assets/images/coin5.png"; // Cardano
import graph from "@/app/assets/images/graph.svg";
import i3 from "@/app/assets/images/i3.svg";
import Image from "next/image";
import TableSkeleton from "./LoadingSkeleton/TableSkeleton";
import { PopularTokens } from "./PopularTokens";
import Link from "next/link";

const tokenImages = {
  BTC: c1,
  ETH: c2,
  BNB: c3,
  XRP: c4,
  ADA: c5,
};

const Dashboard = () => {
  const [totalAssets, setTotalAssets] = useState(0);
  const [tokenList, setTokenList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chainAllocations, setChainAllocations] = useState([]);

  const client = new CovalentClient("cqt_rQjqjFgwBX8t9Mc3qhb4VBYrHgtj");

  useEffect(() => {
    const calculateAllocations = (tokens) => {
      // Predefined list of tokens to always display
      const predefinedTokens = [
        { name: "Bitcoin", symbol: "BTC" },
        { name: "Ethereum", symbol: "ETH" },
        { name: "Binance Coin", symbol: "BNB" },
        { name: "Ripple", symbol: "XRP" },
        { name: "Cardano", symbol: "ADA" },
      ];

      // Calculate total value
      const total = tokens.reduce((acc, token) => {
        return acc + (parseFloat(token.pretty_quote?.replace("$", "")) || 0);
      }, 0);

      // Group tokens by chain/type and calculate their total values
      const chainValues = tokens.reduce((acc, token) => {
        const symbol = token.contract_ticker_symbol;
        const value = parseFloat(token.pretty_quote?.replace("$", "")) || 0;

        if (symbol === "BTC" || symbol === "WBTC")
          acc.Bitcoin = (acc.Bitcoin || 0) + value;
        else if (symbol === "ETH" || symbol === "WETH")
          acc.Ethereum = (acc.Ethereum || 0) + value;
        else if (symbol === "BNB" || symbol === "WBNB")
          acc["Binance Coin"] = (acc["Binance Coin"] || 0) + value;
        else if (symbol === "XRP") acc.Ripple = (acc.Ripple || 0) + value;
        else if (symbol === "ADA") acc.Cardano = (acc.Cardano || 0) + value;

        return acc;
      }, {});

      // Ensure all predefined tokens are included in the final result
      predefinedTokens.forEach((token) => {
        if (!chainValues[token.name]) chainValues[token.name] = 0; // Add missing tokens with 0 value
      });

      // Convert to array format and calculate percentages
      const allocations = Object.entries(chainValues)
        .map(([name, value]) => ({
          name,
          value: `$${value.toFixed(2)}`,
          percentage:
            total > 0 ? `${((value / total) * 100).toFixed(2)}%` : "0.00%",
          image:
            tokenImages[
              name === "Bitcoin"
                ? "BTC"
                : name === "Ethereum"
                ? "ETH"
                : name === "Binance Coin"
                ? "BNB"
                : name === "Ripple"
                ? "XRP"
                : "ADA"
            ],
        }))
        .sort(
          (a, b) =>
            parseFloat(b.value.replace("$", "")) -
            parseFloat(a.value.replace("$", ""))
        );
      return allocations;
    };

    const fetchTokenBalances = async (walletAddress) => {
      try {
        console.log("Fetching token balances for address:", walletAddress);

        const response =
          await client.BalanceService.getTokenBalancesForWalletAddress(
            "eth-mainnet",
            walletAddress
          );
        const tokens = response.data.items;

        if (!tokens) {
          throw new Error("No tokens found or invalid response structure");
        }

        console.log("Fetched tokens:", tokens);

        const total = tokens.reduce((acc, token) => {
          return acc + (parseFloat(token.pretty_quote?.replace("$", "")) || 0);
        }, 0);

        setTotalAssets(total);
        setTokenList(tokens);

        // Calculate and set chain allocations
        const newAllocations = calculateAllocations(tokens);
        setChainAllocations(newAllocations);
      } catch (error) {
        console.error("Error fetching token balances:", error);
      } finally {
        setLoading(false);
      }
    };

    const walletAddress = localStorage.getItem("smartAccount");
    fetchTokenBalances(walletAddress);
  }, []);

  return (
    <div className="flex flex-col xl:flex-row sm:px-[1rem] md:px-[25px] mt-12  gap-6 justify-evenly items-start">
      <div className="w-[100%] xl:w-[70%] space-y-12">
        <div className="bg-[#0e0e0eb3] rounded-2xl px-9 pt-11 pb-14">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-7">
              {/* Total Assets Section */}
              <div className="flex items-center gap-4">
                <div className="items-center justify-center hidden xl:flex">
                  <Image src={i3} alt="assets" className="w-10 h-10" />
                </div>
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-gray-300 xl:text-lg">
                    Total assets
                  </div>
                  <div className="mt-1 text-xl font-bold text-white xl:text-3xl">
                    ${totalAssets}
                  </div>
                </div>
              </div>

              {/* ETH Section */}
              <div className="flex flex-col px-6 border-l border-gray-700">
                <div className="text-sm font-medium text-gray-300 xl:text-lg">
                  ETH
                </div>
                <div className="mt-1 text-xl font-bold text-white xl:text-3xl">
                  {chainAllocations[0]?.value || "$0"}
                </div>
              </div>

              {/* BTC Section */}
              <div className="flex flex-col px-6 border-l border-gray-700">
                <div className="text-sm font-medium text-gray-300 xl:text-lg">
                  BTC
                </div>
                <div className="mt-1 text-xl font-bold text-white xl:text-3xl">
                  {chainAllocations[1]?.value || "$0"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-[100%] gap-12 justify-between items-start">
          <div className=" p-6 w-[100%] bg-[#0e0e0eb3] rounded-[20px] space-y-4">
            <div className="text-xl font-bold">Tokens</div>
            <div className="overflow-y-scroll max-h-56 hide-scrollbar">
              {loading ? (
                <TableSkeleton />
              ) : (
                <PopularTokens popularTokens={tokenList} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-[100%] xl:w-[30%] h-[100%] flex flex-col gap-12">
        <div className="p-6 rounded-2xl backdrop-blur-sm bg-[#0e0e0eb3] space-y-7">
          <div className="text-2xl font-bold">Chain Allocation</div>
          <div className="space-y-5">
            {loading ? (
              <ChainAllocationSkeleton />
            ) : (
              chainAllocations.map((allocation, index) => (
                <div key={index} className="space-y-3.5">
                  <div className="flex items-center justify-between font-semibold">
                    <div className="flex items-center gap-2">
                      <div>
                        <Image
                          src={allocation.image}
                          alt={allocation.name}
                          width={32}
                          height={32}
                        />
                      </div>
                      <div className="text-base">{allocation.name}</div>
                    </div>
                    <div>{allocation.value}</div>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <div
                      className={`w-[70%] p-[5px] rounded-lg h-[10px] relative block 
                  ${allocation.percentage === "0.00%" ? "" : "assets-per"}
                `}
                      style={{
                        width: allocation.percentage,
                      }}
                    ></div>
                    <div>{allocation.percentage}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col items-center bg-[#1C1C1C] rounded-2xl px-6 py-8 gap-6 justify-evenly shadow-lg max-w-lg mx-auto">
          <div className="text-lg font-bold text-center text-white">
            Manage Your Tokens
          </div>
          <div className="text-xs text-center text-gray-400 md:text-sm max-w-[80%] mx-auto">
            Easily send and receive tokens securely and efficiently. Get started
            below!
          </div>
          <div className="flex w-full gap-4">
            <Link
              href="/send&receive"
              className="w-1/2 px-6 py-3 text-xs font-semibold text-center text-[#b82300] transition-all border-2 border-[#b82300] rounded-xl hover:bg-[#b82300] hover:text-white md:text-sm"
            >
              SEND
            </Link>
            <Link
              href="/send&receive?tab=send"
              className="w-1/2 px-6 py-3 text-xs font-semibold text-center text-green-600 transition-all border-2 border-green-600 rounded-xl hover:bg-green-600 hover:text-white md:text-sm"
            >
              RECEIVE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

const ChainAllocationSkeleton = () => {
  const skeletonItems = Array(5).fill(0);

  return (
    <div className="space-y-5">
      {skeletonItems.map((_, index) => (
        <div key={index} className="space-y-3.5">
          <div className="flex items-center justify-between font-semibold">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
              <div className="w-24 h-4 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="w-16 h-4 bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center justify-between gap-1">
            <div className="w-[70%] h-[10px] bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="w-10 h-4 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
