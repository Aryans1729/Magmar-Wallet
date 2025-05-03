import React from "react";
import TableSkeleton from "./LoadingSkeleton/TableSkeleton";
import { formatUnits } from "ethers";

export const PopularTokens = ({ popularTokens }) => {
  const truncateString = (str) => {
    if (!str) return "";
    return str.length <= 5 ? str : `${str.slice(0, 5)}....${str.slice(-3)}`;
  };

  const addressCopyHandler = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Address copied!", { theme: "dark" });
  };

  const dateFormat = (str) => (str ? str.slice(0, 10) : "");

  return (
    <div className="relative overflow-x-auto max-h-[400px] rounded-md shadow-md">
      {popularTokens && popularTokens.length > 0 ? (
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-400 uppercase bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                USD Value
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900">
            {popularTokens.map((token) => (
              <tr
                className="border-b border-gray-700 hover:bg-gray-800"
                key={token?.contract_address}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-200 whitespace-nowrap"
                >
                  {token?.contract_display_name || "N/A"}
                </th>
                <td className="px-6 py-4">
                  {token?.balance
                    ? formatUnits(token.balance, token.contract_decimals)
                    : "N/A"}
                </td>
                <td className="px-6 py-4 text-right">
                  {token?.pretty_quote || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <TableSkeleton />
      )}
    </div>
  );
};
