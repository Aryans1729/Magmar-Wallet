"use client";

import { UseStateManagement } from "@/StateManagement/index";
import Transaction from "../../components/Transaction";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const page = () => {
  const { testing, setLoggedIn, loggedIn, userAccount } = UseStateManagement();
  // const router = useRouter();

  console.log(userAccount);

  // useEffect(() => {
  //   router.back();
  // }, []);

  return (
    <>
      <Transaction />
    </>
  );
};

export default page;
