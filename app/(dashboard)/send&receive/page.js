"use client";

import { UseStateManagement } from "@/StateManagement/index";
import SendAndReceive from "../../components/SendAndReceive";

const page = ({ searchParams }) => {
  const { testing, setLoggedIn, loggedIn, userAccount } = UseStateManagement();

  console.log(userAccount);

  return (
    <>
      <SendAndReceive currentTab={searchParams.tab} />
    </>
  );
};

export default page;
