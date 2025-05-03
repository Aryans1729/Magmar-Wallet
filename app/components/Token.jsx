import React, { useEffect } from "react";

import { UseStateManagement } from "@/StateManagement/index";
import TableSkeleton from "./LoadingSkeleton/TableSkeleton";

import { ethers } from "ethers";

import {} from "ethers";

const Token = () => {
  const { tokenDetails, getTokenBalance } = UseStateManagement();

  useEffect(() => {
    getTokenBalance();
  }, []);

  // console.log(tokenDetails)

  function truncateString(str) {
    if (str.length <= 5) {
      return str;
    }

    const start = str.slice(0, 5);
    const end = str.slice(-3);

    return `${start}....${end}`;
  }

  function convertBalance(balance, decimals) {
    let balanceInInt = Number(balance);

    let decimalNumber = Math.pow(10, decimals);

    let result = balanceInInt / decimalNumber;

    return String(result).slice(0, 6);
  }

  //     function convertBalance(balance, decimals) {
  //     // Ensure balance is a BigNumber
  //     let balanceInBigNumber = ethers.BigNumber.from(balance.toString());

  //     // Convert decimals to BigNumber
  //     let decimalsInBigNumber = ethers.BigNumber.from(10).pow(decimals);

  //     // Perform the division to get the balance in smallest units (e.g., wei to ether)
  //     let balanceInSmallestUnit = balanceInBigNumber.div(decimalsInBigNumber);

  //     // Convert the balance in smallest units to a number if it's safe to do so
  //     let balanceInNumber;
  //     if (balanceInSmallestUnit.lt(Number.MAX_SAFE_INTEGER)) {
  //         balanceInNumber = balanceInSmallestUnit.toNumber();
  //     } else {
  //         // If the balance is too large to convert safely, return as a string
  //         balanceInNumber = balanceInSmallestUnit.toString();
  //     }

  //     return balanceInNumber;
  // }

  return (
    <>
      {tokenDetails ? (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
          <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
            <thead className="text-xs uppercase">
              <tr>
                <th scope="col" className="px-6 py-3">
                  {/* Name */}
                  Token
                </th>
                <th scope="col" className="px-6 py-3" align="left">
                  {/* Token */}
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3">
                  {/* Contract Address */}
                  Price
                </th>
                <th scope="col" className="px-6 py-3">
                  {/* Quantity */}
                  Transferred At
                </th>
                <th scope="col" className="px-6 py-3" align="right">
                  {/* Price */}
                  NAN For Now
                </th>
                <th scope="col" className="px-6 py-3" align="right">
                  {/* Transferred at */}
                  NAN For Now
                </th>
              </tr>
            </thead>
            <tbody>
              {tokenDetails ? (
                tokenDetails?.map((token) => (
                  <tr className="bg-[#1c1c1e] border-b border-[#2e2e32]">
                    <th
                      scope="row"
                      className="flex items-center gap-2 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {/* <div>
                            <img src={token?.logo_url} className='rounded-full max-h-10 min-w-10' alt='' />
                             </div> */}
                      <div className="w-[5rem]">{token.contract_name}</div>
                    </th>
                    <td className="px-6 py-4">
                      {/* {token.contract_ticker_symbol} */}
                      {convertBalance(
                        token.balance,
                        token.contract_decimals
                      )}{" "}
                      {token.contract_ticker_symbol}
                    </td>
                    <td className="px-6 py-4">
                      {/* {truncateString(token.contract_address)} */}

                      {token.pretty_quote}
                    </td>
                    <td className="px-6 py-4">
                      {/* 1824. ETH */}

                      {String(token.last_transferred_at).slice(3, 11)}
                    </td>
                    <td className="px-6 py-4" align="right">
                      {/* $2999 */}
                    </td>
                    <td className="px-6 py-4" align="right">
                      {/* {String(token.last_transferred_at).slice(3, 11)} */}
                    </td>
                  </tr>
                ))
              ) : (
                <TableSkeleton />
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <TableSkeleton />
      )}
    </>
  );
};

export default Token;
