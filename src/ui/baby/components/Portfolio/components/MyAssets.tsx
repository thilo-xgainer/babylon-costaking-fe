import btcLogo from "@/ui/common/assets/bitcoin.png";
import babyLogo from "@/ui/common/assets/baby.png";
import React from "react";
import { formatNumber } from "@/ui/common/utils/formTransforms";

interface AssetItemProps {
  token: "btc" | "baby";
  amount: number;
  apy: number;
  value: number;
  isLast: boolean;
}

const AssetItem: React.FC<AssetItemProps> = ({
  token,
  amount,
  value,
  isLast,
}) => {
  return (
    <div className="relative flex w-full items-center gap-2 py-4 pl-[14px] pr-4">
      <div className="flex w-1/2 items-center gap-4">
        <img
          src={token === "btc" ? btcLogo : babyLogo}
          className="h-8 w-8"
          alt={token}
        />
        <div className="flex flex-col items-start gap-1">
          <p className="font-bold">{formatNumber(amount)}</p>
          <p className="text-sm text-[#8da5bf]">{token.toUpperCase()}</p>
        </div>
      </div>
      <div className="flex flex-col items-start gap-1">
        <p className="font-bold">${formatNumber(value)}</p>
        <p className="text-sm text-[#8da5bf]">USD Value</p>
      </div>
      {!isLast && (
        <div className="absolute bottom-0 left-[17.5%] h-[1px] w-[65%] bg-[#e4e3e3]"></div>
      )}
    </div>
  );
};

export const MyAssets = () => {
  return (
    <div>
      <p>My Assets</p>
      <div className="flex w-full flex-col items-center gap-2 bg-[#f9f9f9]">
        <AssetItem
          token="btc"
          amount={323000.45}
          apy={7}
          value={1000000}
          isLast={false}
        />
        <AssetItem token="baby" amount={3230} apy={7} value={10000} isLast />
      </div>
    </div>
  );
};
