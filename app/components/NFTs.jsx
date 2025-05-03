import React, { useEffect } from "react";

import { UseStateManagement } from "@/StateManagement/index";
import TableSkeleton from "./LoadingSkeleton/TableSkeleton";

const NFTs = () => {
  const { nftDetails, getNFTs } = UseStateManagement();

  useEffect(() => {
    getNFTs();
  }, []);

  function truncateString(str) {
    if (str.length <= 5) {
      return str;
    }

    const start = str.slice(0, 5);
    const end = str.slice(-3);

    return `${start}....${end}`;
  }

  function roundToFloor(number) {
    let factor = Math.pow(10, 3);
    return Math.floor(number * factor) / factor;
  }

  console.log("Get nfts:", nftDetails);

  return (
    <div>
      {nftDetails ? (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
            <thead className="text-xs uppercase ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Collection name
                </th>
                <th scope="col" className="px-6 py-3">
                  Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Contract address
                </th>
                <th scope="col" className="px-6 py-3">
                  Floor price
                </th>

                <th scope="col" className="px-6 py-3">
                  Minted
                </th>
              </tr>
            </thead>
            <tbody>
              {nftDetails?.map((nft, i) => (
                <tr key={i} className="bg-[#1c1c1e] border-b border-[#2e2e32]">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {i + 1}. {nft.contract_name}
                  </th>
                  <td className="px-6 py-4">{nft.type}</td>
                  <td className="px-6 py-4">
                    {truncateString(nft.contract_address)}
                  </td>
                  <td className="px-6 py-4">
                    {roundToFloor(nft.floor_price_quote)}
                  </td>

                  <td className="px-6 py-4">
                    {String(nft.last_transfered_at).slice(3, 11)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <TableSkeleton />
      )}
    </div>
  );
};

export default NFTs;
