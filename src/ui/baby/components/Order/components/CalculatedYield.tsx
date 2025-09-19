import btcLogo from "@/ui/common/assets/bitcoin.png";
import babyLogo from "@/ui/common/assets/baby-token.svg";
import React from "react";
import { useParams } from "react-router";
import { useOrderDetail } from "@/ui/common/hooks/client/api/useOrderDetail";
import { useCosmwasmQuery } from "@/ui/common/hooks/client/useCosmwasmQuery";
import { ubbnToBaby } from "@/ui/common/utils/bbn";

interface AprProps {
  type: "btc" | "baby";
  apr: number;
  stakedAmount: number;
}

const Apr: React.FC<AprProps> = ({ type, apr, stakedAmount }) => {
  return (
    <div className="flex w-1/2 flex-col gap-3 bg-[#f9f9f9] p-4 dark:bg-[#252525]">
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
  const { orderAddress } = useParams();
  const { data: orderDetail } = useOrderDetail({
    enabled: true,
    orderAddress: orderAddress ?? "",
  });
  const { data: tokenDeposited } = useCosmwasmQuery({
    contractAddress: orderAddress ?? "",
    queryMsg: {
      get_total_token_staked: {},
    },
  });

  return (
    <div>
      <p>Calculated Yields</p>
      <div className="relative flex items-center">
        <Apr
          type="btc"
          apr={0.5}
          stakedAmount={orderDetail ? orderDetail[0].btcAmount / 1e8 : 0}
        />
        <Apr
          type="baby"
          apr={6}
          stakedAmount={ubbnToBaby(tokenDeposited ?? 0)}
        />
        <div className="bot-4 absolute left-1/2 right-1/2 top-4 h-[65%] w-[1px] bg-[#dadada]"></div>
      </div>
    </div>
  );
};
