import { Outlet } from "react-router";
import { twJoin } from "tailwind-merge";

import { network } from "@/ui/common/config/network/btc";
import { Network } from "@/ui/common/types/network";
import { ValidatorState } from "@/ui/baby/state/ValidatorState";

import "@/ui/globals.css";

// import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";

export default function RootLayout() {
  return (
    <div
      className={twJoin(
        `relative h-full min-h-svh w-full bg-[#F6FAFE] dark:bg-[#15202B]`,
        network === Network.MAINNET ? "main-app-mainnet" : "main-app-testnet",
      )}
    >
      <div className="flex min-h-svh flex-col">
        <Header />

        <ValidatorState>
          <Outlet />
        </ValidatorState>

        {/* <div className="mt-auto">
          <Footer />
        </div> */}
      </div>
    </div>
  );
}
