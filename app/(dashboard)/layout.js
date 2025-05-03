// "use client";

// import Header from "@/app/components/layout/Header";
// import NavDrawer from "@/app/components/layout/NavDrawer";
// import React from "react";

// export default function DashboardLayout({ children }) {
//   return (
//     <div className="relative flex bg_container max-w-[1560px] mx-auto">
//       {/* Sticky NavDrawer */}
//       <div className="sticky top-0 z-50 h-screen">
//         <NavDrawer />
//       </div>
//       <div className="flex flex-col flex-1">
//         <Header />

//         {children}
//       </div>
//     </div>
//   );
// }

"use client";

import Header from "@/app/components/layout/Header";
import NavDrawer from "@/app/components/layout/NavDrawer";
import { UseStateManagement } from "@/StateManagement";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const { web3auth, setProvider, createSmartAccount } = UseStateManagement();

  const router = useRouter();

  useEffect(() => {
    if (web3auth.status === "connected") {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [web3auth.status]);

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

  return (
    <div className="relative flex bg_container max-w-[1560px] mx-auto">
      {/* Sticky NavDrawer */}
      <div className="sticky top-0 z-50 h-screen">
        <NavDrawer />
      </div>
      <div className="flex flex-col flex-1">
        <Header />

        {children}
      </div>
    </div>
  );
}
