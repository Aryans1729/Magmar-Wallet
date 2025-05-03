import React, { useEffect, useState } from "react";

import { UseStateManagement } from "@/StateManagement/index";
import Image from "next/image";
import Token from "./Token";
import NFTs from "./NFTs";

const TokenAndNFTs = () => {
  const { tokenDetails, getTokenBalance } = UseStateManagement();
  const [tab, setTab] = useState(0);

  useEffect(() => {
    getTokenBalance();
  }, []);

  console.log(tokenDetails);

  function truncateString(str) {
    if (str.length <= 5) {
      return str;
    }

    const start = str.slice(0, 5);
    const end = str.slice(-3);

    return `${start}....${end}`;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="px-3 sm:px-[2rem] md:px-[5rem] py-[2rem] gap-4 w-[100%] xl:w-[70vw] max-w-[83rem] xl:min-w-[78rem]">
        <div className="flex justify-center gap-5 text-[24px] font-bold my-5">
          <button
            onClick={() => setTab(0)}
            className={`link ${tab === 0 && "link-selected"} w-[10rem]`}
          >
            TOKENS
          </button>
          <button
            onClick={() => setTab(1)}
            className={`link ${tab === 1 && "link-selected"} w-[10rem]`}
          >
            NFTs
          </button>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
          {tab === 0 && <Token />}
          {tab === 1 && <NFTs />}
        </div>
      </div>
    </div>
  );
};

export default TokenAndNFTs;
