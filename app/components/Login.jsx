import Image from "next/image";
import React, { useEffect } from "react";
import logo from "@/app/assets/images/BigLogo.png";

import { UseStateManagement } from "@/StateManagement/index";
import { useRouter } from "next/navigation";

const Login = () => {
  const { handleLogin, web3auth, setProvider, createSmartAccount } =
    UseStateManagement();

  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setProvider(web3auth.provider);

        console.log("web3auth:", web3auth);

        if (web3auth) {
          createSmartAccount();
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (web3auth.status === "connected") {
      router.push("/dashboard");
    }
  }, [web3auth.status]);

  return (
    <div className="login-bg h-[100vh] px-3 sm:px-[2rem] md:px-[5rem] py-[2rem] flex gap-[5rem] flex-col items-center overflow-hidden relative">
      <div className="w-[90vw] lg:w-[40vw]  max-w-[40rem] p-[2rem] min-h-[24rem] loginContainer-bg relative flex items-center flex-col gap-3 justify-center">
        <div>
          <Image
            src={logo}
            className="logo-login"
            alt="MAGMAR"
            style={{ height: "6rem", width: "6rem" }}
          />
        </div>
        <div className="text-[#f78231] font-bold text-[32px]">
          Magmar Wallet
        </div>
        <div className="text-[#f78231] font-medium text-center text-[24px] ">
          A Smart Wallet Simplifying Crypto Transactions and Asset Management
          Securely
        </div>
        <div className="py-4">
          {/* <button onClick={() => handleLogin()} className="login_btn"> */}
          <button onClick={handleLogin} className="login_btn">
            Create account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
