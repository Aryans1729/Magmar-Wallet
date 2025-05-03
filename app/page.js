"use client";

import { useEffect } from "react";

import { UseStateManagement } from "@/StateManagement/index";
import { useRouter } from "next/navigation";
import Loading from "./components/Loading";

const Page = () => {
  const { web3auth } = UseStateManagement();

  const router = useRouter();

  // console.log("USER ACCOUNT:", userAccount);
  // console.log("Isconnected: ", web3auth?.connected);
  // console.log("status: ", web3auth?.status);

  useEffect(() => {
    if (web3auth.status === "connected") {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [web3auth.status]);

  return (
    <div className="grid w-full h-screen place-items-center">
      <Loading />
    </div>
  );
};

export default Page;
