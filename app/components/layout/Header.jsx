import Image from "next/image";
import React, { useEffect, useState } from "react";
import logo from "@/app/assets/images/BigLogo.png";
import { MdAccountCircle } from "react-icons/md";
import { UseStateManagement } from "@/StateManagement";
import { Tooltip } from "react-tippy";
import { ChainSelector } from "../chain-selector";

const Header = () => {
  const { userAccount, changeNetwork } = UseStateManagement();
  const [tooltipAlert, setTooltipAlert] = useState("Copy address");

  function truncateString(str) {
    if (str.length <= 5) {
      return str;
    }

    const start = str.slice(0, 7);
    const end = str.slice(-5);

    return `${start}....${end}`;
  }

  const copyHandler = () => {
    window.navigator.clipboard.writeText(userAccount).then(() => {
      setTooltipAlert("Address copied!");
    });
  };

  return (
    <div className="flex bg-transparent items-center w-full px-3 sm:px-[25px] md:px-[25px] pt-[24px] mb-4">
      {/* <div className='flex items-center gap-2 text-2xl font-bold lg:gap-4'>
           Dashboard
        </div> */}

      <div className="flex items-center gap-3 ml-auto">
        <div>
          {/* <ChainSelector /> */}
        </div>

        <div className="flex items-center gap-2 p-1 pr-3 ml-auto rounded-full nav-drawer red-container lg:py-1 lg:px-1">
          <div>
            <MdAccountCircle style={{ height: "40px", width: "40px" }} />
          </div>
          <div
            onMouseLeave={() => {
              setTooltipAlert("Copy address");
            }}
          >
            <Tooltip title={tooltipAlert} hideOnClick={false}>
              <div
                onClick={copyHandler}
                className="text-[12px] lg:text-[16px] font-bold cursor-pointer"
              >
                {truncateString(userAccount ? userAccount : "")}
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
