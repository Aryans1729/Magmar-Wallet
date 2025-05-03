import React, { useState } from "react";
import { BiSolidDashboard } from "react-icons/bi";
import { RiSendPlaneFill } from "react-icons/ri";
import { GrTransaction } from "react-icons/gr";
import { RiFilePaper2Fill } from "react-icons/ri";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "react-tippy/dist/tippy.css";
import { Tooltip } from "react-tippy";
import logo from "@/app/assets/images/BigLogo.png";
import Image from "next/image";

const NavDrawer = () => {
  const pathname = usePathname();

  return (
    <>
      <div className="fixed lg:relative nav-drawer shadow-sm h-[5rem] w-[100vw] lg:left-0 lg:top-0 bottom-0 lg:h-[100vh] lg:w-[240px] bg-black lg:bg-transparent flex flex-row lg:flex-col gap-6 lg:items-start lg:pt-[24px] px-[24px] text-[36px] justify-center items-center lg:justify-start">
        <div className="items-center hidden gap-4 mb-6 lg:gap-4 lg:flex">
          <Image
            style={{ height: "3rem", width: "3rem" }}
            src={logo}
            alt="MAGMAR"
          />
          <header className="hidden text-2xl font-bold sm:block">
            MAGMAR
          </header>
        </div>
        <Link
          href="/dashboard"
          className={`link lg:w-[100%] ${
            pathname === "/" || pathname === "/dashboard" ? "link-selected" : ""
          }`}
        >
          <div className="flex items-center lg:gap-5">
            <BiSolidDashboard className="w-6 h-6" />
            <div className="text-[16px] hidden lg:block">Dashboard</div>
          </div>
        </Link>
        <Link
          href="/send&receive"
          className={`link lg:w-[100%] ${
            pathname === "/send&receive" ? "link-selected" : ""
          }`}
        >
          <div className="flex items-center gap-5">
            <RiSendPlaneFill className="w-6 h-6" />
            <div className="text-[16px] hidden lg:block">Send/Receive</div>
          </div>
        </Link>
        <Link
          href="/transaction"  
          className={`link lg:w-[100%] ${
            pathname === "/transaction" ? "link-selected" : ""
          }`}
        >
          <div className="flex items-center gap-5">
            <GrTransaction className="w-6 h-6" />
            <div className="text-[16px] hidden lg:block text-white">
              Transactions
            </div>
          </div>
        </Link>
        <Link
          href="https://magmar.gitbook.io/magmar/"
          target="_blank"
          className="link lg:w-[100%]"
        >
          <div className="flex items-center gap-5">
            <RiFilePaper2Fill className="w-6 h-6" />
            <div className="text-[16px] hidden lg:block">Whitepaper</div>
          </div>
        </Link>
      </div>
      <div></div>
    </>
  );
};

export default NavDrawer;
