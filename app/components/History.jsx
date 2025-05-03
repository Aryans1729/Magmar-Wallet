import React, { useEffect, useState } from 'react';
import Loading from './Loading';
import TableSkeleton from './LoadingSkeleton/TableSkeleton';
import Link from "next/link";

const History = () => {
    const [txDetails, setTxDetails] = useState([]);
    const walletAddress = localStorage.getItem("smartAccount");
    const [loading, setLoading] = useState(false);
    const apiKey = process.env.NEXT_PUBLIC_BASESCAN_API_KEY; // Get API key from environment variable

    // Fetch transaction history using the provided API
    const getTransactionHistory = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://api.basescan.org/api?module=account&action=txlistInternal&address=${walletAddress}&startblock=0&endblock=99999999999999999999999&page=1&offset=20&sort=desc&apikey=${apiKey}`,
                { method: 'GET' }
            );

            if (response.ok) {
                const data = await response.json();
                if (data.status === "1") {
                    setTxDetails(data.result);
                } else {
                    console.error('Error in API response:', data.message);
                }
            } else {
                console.error('Error fetching transactions:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (apiKey) {
            getTransactionHistory();
        } else {
            console.error('API key not found in environment variables.');
        }
    }, [apiKey]);

    const truncateString = (str, startLen = 5, endLen = 3) => {
        if (!str || str.length <= startLen + endLen) {
            return str;
        }
        return `${str.slice(0, startLen)}...${str.slice(-endLen)}`;
    };

    const createTransactionHistoryLink = (hash) => {
        return `https://etherscan.io/tx/${hash}`;
    };

    return (
        <div className="relative overflow-x-auto sm:rounded-lg px-3 sm:px-[2rem] md:px-[5rem] py-[2rem] gap-4 w-[100%] xl:w-[70vw] max-w-[83rem] h-[40rem]">
            <header className="text-lg font-bold mb-4">Transactions</header>
            {loading ? (
                <TableSkeleton />
            ) : txDetails?.length > 0 ? (
                <table className="w-full my-5 text-sm text-left text-gray-500 rtl:text-right shadow-container">
                    <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Value (ETH)</th>
                            <th scope="col" className="px-6 py-3">Sender</th>
                            <th scope="col" className="px-6 py-3">Receiver</th>
                            <th scope="col" className="px-6 py-3">Hash</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {txDetails.map((transaction) => (
                            <tr key={transaction.hash} className="border-b border-gray-300">
                                <td className="px-6 py-4">
                                    {(transaction.value / 1e18).toFixed(5)} ETH
                                </td>
                                <td className="px-6 py-4">
                                    {truncateString(transaction.from)}
                                </td>
                                <td className="px-6 py-4">
                                    {truncateString(transaction.to)}
                                </td>
                                <td className="px-6 py-4">
                                    <Link href={createTransactionHistoryLink(transaction.hash)} target="_blank">
                                        {truncateString(transaction.hash, 10, 8)}
                                    </Link>
                                </td>
                                <td className="px-6 py-4">
                                    {new Date(transaction.timeStamp * 1000).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No transactions found.</p>
            )}
        </div>
    );
};

export default History;
