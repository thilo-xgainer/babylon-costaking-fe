import btcLogo from "@/ui/common/assets/bitcoin.png";
import babyLogo from "@/ui/common/assets/baby-token.svg";
import React from "react";

interface AprProps {
  type: "btc" | "baby";
  apr: number;
  stakedAmount: number;
}

const Apr: React.FC<AprProps> = ({ type, apr, stakedAmount }) => {
  return (
    <div className="bg-[#f9f9f9] dark:bg-[#252525] p-4 w-1/2 flex flex-col gap-3">
      <div className="flex w-full items-center justify-between">
        <p>Staked {type.toUpperCase()}</p>
        <img
          src={type === "btc" ? btcLogo : babyLogo}
          className="h-6 w-6"
          alt={type}
        />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold">{stakedAmount}</span>
          <span className="text-xs font-normal"> {type.toUpperCase()}</span>
        </div>
        <span className="text-2xl font-bold text-green-500">{apr}%</span>
      </div>
    </div>
  );
};

export const CalculatedYield = () => {
  return (
    <div>
      <p>Calculated Yields</p>
      <div className="flex items-center relative">
        <Apr type="btc" apr={0.5} stakedAmount={5} />
        <Apr type="baby" apr={6} stakedAmount={25} />
        <div className="absolute w-[1px] h-[65%] top-4 bot-4 left-1/2 right-1/2 bg-[#dadada]"></div>
      </div>
    </div>
  );
};
