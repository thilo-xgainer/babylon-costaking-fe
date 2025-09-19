import * as React from "react";

import btcLogo from "@/ui/common/assets/bitcoin.png";
import babyLogo from "@/ui/common/assets/baby.png";
import { useUserAssets } from "@/ui/baby/hooks/services/useUserAssets";
import { usePrices } from "@/ui/common/hooks/client/api/usePrices";
import { formatCurrency } from "@/ui/common/utils/formatCurrency";

interface AssetItemProps {
  token: "btc" | "baby";
  amount: string;
  apy: number;
  value: string;
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
          <p className="font-bold">{amount}</p>
          <p className="text-sm text-[#8da5bf]">{token.toUpperCase()}</p>
        </div>
      </div>
      <div className="flex flex-col items-start gap-1">
        <p className="font-bold">{value}</p>
        <p className="text-sm text-[#8da5bf]">USD Value</p>
      </div>
      {!isLast && (
        <div className="absolute bottom-0 left-[17.5%] h-[1px] w-[65%] bg-[#e4e3e3]"></div>
      )}
    </div>
  );
};

export const MyAssets = () => {
  const { btc, baby } = useUserAssets();
  const { data: prices } = usePrices();
  return (
    <div>
      <p>My Assets</p>
      <div className="flex w-full flex-col items-center gap-2 bg-[#f9f9f9] dark:bg-[#252525]">
        <AssetItem
          token="btc"
          amount={formatCurrency(btc, {
            prefix: "",
            format: {
              maximumFractionDigits: 8,
              minimumFractionDigits: 0,
            },
          })}
          apy={7}
          value={formatCurrency(btc * (prices?.BTC ?? 0), {
            precision: 2,
            prefix: "$",
          })}
          isLast={false}
        />
        <AssetItem
          token="baby"
          amount={formatCurrency(baby, {
            prefix: "",
            format: {
              maximumFractionDigits: 6,
              minimumFractionDigits: 0,
            },
          })}
          apy={7}
          value={formatCurrency(baby * (prices?.BABY ?? 0), {
            precision: 2,
            prefix: "$",
          })}
          isLast={true}
        />
      </div>
    </div>
  );
};
