import React from "react";
import { OREDER_CONTRACT_ADDRESS } from "../../../common/constants";
import tbabyLogo from "../../../common/assets/baby.png";
import { useCosmosWallet } from "@/ui/common/context/wallet/CosmosWalletProvider";
import { useCosmwasmQuery } from "@/ui/common/hooks/client/useCosmwasmQuery";
import { ubbnToBaby } from "../../../common/utils/bbn";
import { timeRemaining } from "../../../../utils/format";
import { ClockIcon } from "../../../icon/ClockIcon";

type PendingRequest = {
  amount: string;
  unlock_at: number;
};

export const WithdrawCard = () => {
  const { bech32Address } = useCosmosWallet();
  const {
    data: redeemRequest,
    isLoading: isRedeemRequestLoading,
    refetch: refetchRedeemRequest,
  } = useCosmwasmQuery<PendingRequest[]>({
    contractAddress:
      "bbn16l8yy4y9yww56x4ds24fy0pdv5ewcc2crnw77elzfts272325hfqwpm4c3",
    queryMsg: {
      get_redeem_request: {
        user: bech32Address,
      },
    },
  });
  const {
    data: withdrawlAmount,
    isLoading: isWirhdrawalAmountLoading,
    refetch: refetcWithdrawlAmount,
  } = useCosmwasmQuery<PendingRequest[]>({
    contractAddress:
      "bbn16l8yy4y9yww56x4ds24fy0pdv5ewcc2crnw77elzfts272325hfqwpm4c3",
    queryMsg: {
        get_withdrawal_amount: {
        user: bech32Address,
      },
    },
  });
  console.log("redeemRequest: ", redeemRequest, withdrawlAmount);

  return (
    <div>
      <div className="bg-[#F9F9F9] p-4">
        <p>Pending Reqest</p>
        <div className="w-full flex flex-col items-center">
            {
                withdrawlAmount != 0 && (
                    <div  className="w-1/2 px-6 py-3 flex justify-between items-center bg-[#1b5f79]">
              <div className="flex items-center gap-1">
                <img src={tbabyLogo} />
                <div className="flex flex-col items-start text-white">
                  <p>{ubbnToBaby(withdrawlAmount)}</p>
                  <p>BABY</p>
                </div>
              </div>
              <button className="cursor-pointer flex items-center gap-1 bg-[#f0f0f0] p-4 text-center hover:opacity-75 text-[#547496]">
                Withdraw
              </button>
            </div>
                )
            }
          {redeemRequest?.map((request, index) => (
            <div key={index} className="w-1/2 px-6 py-3 flex justify-between items-center bg-[#1b5f79]">
              <div className="flex items-center gap-1">
                <img src={tbabyLogo} />
                <div className="flex flex-col items-start text-white">
                  <p>{ubbnToBaby(request.amount)}</p>
                  <p>BABY</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-[#f1f1f1] p-4 text-center cursor-pointer text-[#547496]">
                {timeRemaining(request.unlock_at)}
                <ClockIcon size={16}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
