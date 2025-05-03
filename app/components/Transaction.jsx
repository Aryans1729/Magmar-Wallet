"use client";

import React from "react";
import dynamic from "next/dynamic";

// import History from "./History";
const History = dynamic(() => import("./History"), { ssr: false });

const Transaction = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <History />
    </div>
  );
};

export default Transaction;
