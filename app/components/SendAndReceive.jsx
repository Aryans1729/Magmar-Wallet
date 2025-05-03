import React, { useEffect, useState } from "react";

import { UseStateManagement } from "@/StateManagement/index";
import Image from "next/image";
import Token from "./Token";
import NFTs from "./NFTs";
import Send from "./Send";
import Receive from "./Receive";
import Loading from "./Loading";

const SendAndReceive = ({ currentTab }) => {
  const { tokenDetails, getTokenBalance, loading, setLoading } =
    UseStateManagement();
  const [tab, setTab] = useState(currentTab === "send" ? 1 : 0);

  useEffect(() => {
    setLoading(true);
    getTokenBalance();
    setLoading(false);
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

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="px-3 sm:px-[2rem] md:px-[5rem] py-[2rem] gap-2 w-[100%] max-w-[80rem]">
            <div className="flex justify-center gap-5 text-[24px] font-bold my-5 w-full">
              <button
                onClick={() => setTab(0)}
                className={`link ${
                  tab === 0 && "link-selected"
                } px-5 w-[10rem]`}
              >
                Send
              </button>
              <button
                onClick={() => setTab(1)}
                className={`link ${
                  tab === 1 && "link-selected"
                } px-5 w-[10rem]`}
              >
                Receive
              </button>
            </div>
            {/* <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-[#0e0e0eb3] rounded-2xl px-10 pt-12 pb-16"> */}
            {tab === 0 && <Send />}
            {tab === 1 && <Receive />}
            {/* </div> */}
          </div>
        </div>
      )}
    </>
  );
};

export default SendAndReceive;
