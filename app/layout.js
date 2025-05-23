import "./globals.css";

import { StateManagementProvider } from "@/StateManagement/index";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { WagmiProviderComponent } from "./components/provider/wagmi-provider";

const poppins = Poppins({ weight: ["400", "700"], subsets: ["latin"] });

export const metadata = {
  title: "Magmar Wallet",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <WagmiProviderComponent>
          <StateManagementProvider>
            {children}
            <Toaster />
          </StateManagementProvider>
        </WagmiProviderComponent>
      </body>
    </html>
  );
}
