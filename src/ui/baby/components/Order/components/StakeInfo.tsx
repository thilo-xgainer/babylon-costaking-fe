import babylon from "@/infrastructure/babylon";
import { useRedeemState } from "@/ui/baby/state/RedeemState";
import { useWithdrawState } from "@/ui/baby/state/WithdrawState";
import babyLogo from "@/ui/common/assets/baby-token.svg";
import { useCosmosWallet } from "@/ui/common/context/wallet/CosmosWalletProvider";
import { useCosmwasmQuery } from "@/ui/common/hooks/client/useCosmwasmQuery";
import { ubbnToBaby } from "@/ui/common/utils/bbn";
import { maxDecimals } from "@/ui/common/utils/maxDecimals";
import { useParams } from "react-router";

export const StakeInfo = () => {
  const { displayBalance: stakedAmount, exchangeRate } = useRedeemState();
  const { withdrawalAmount, redeemRequest } = useWithdrawState();
  const { orderAddress } = useParams();
  const { bech32Address } = useCosmosWallet();
  const { data: totalAmount = 0 } = useCosmwasmQuery({
    contractAddress: orderAddress!,
    queryMsg: {
      get_user_staked: {
        user: bech32Address,
      },
    },
    options: { enabled: !!orderAddress },
  });
  const pendingAmount = totalAmount
    ? (babylon.utils.ubbnToBaby(totalAmount) * Number(exchangeRate) - stakedAmount)
    : 0;
  return (
    <div>
      <p>Your Staked Info</p>
      <div className="flex w-full flex-col items-start gap-3 p-4">
        <div className="w-full bg-[#f9f9f9] p-3 dark:bg-[#252525]">
          <p className="text-xl font-semibold">Stake</p>
          <div className="relative mx-auto flex w-full items-center justify-between gap-1 p-2">
            <div className="flex w-1/2 flex-col items-center">
              <p className="text-sm font-bold">Staked Amount</p>
              <div className="mt-2 flex items-center gap-1">
                <p className="text-2xl">{maxDecimals(stakedAmount, 6) }</p>
                <img src={babyLogo} className="h-6 w-6" alt="baby" />
              </div>
            </div>
            <div className="flex w-1/2 flex-col items-center">
              <p className="text-sm font-bold">Pending Amount</p>
              <div className="mt-2 flex items-center gap-1">
                <p className="text-2xl">{maxDecimals(pendingAmount, 6)}</p>
                <img src={babyLogo} className="h-6 w-6" alt="baby" />
              </div>
            </div>
            <div className="bot-4 absolute left-1/2 right-1/2 top-4 h-[65%] w-[1px] bg-[#dadada]"></div>
          </div>
        </div>
        <div className="w-full bg-[#f9f9f9] p-3 dark:bg-[#252525]">
          <p className="text-xl font-semibold">Withdraw</p>
          <div className="relative mx-auto flex w-full items-center justify-between gap-1 p-2">
            <div className="flex w-1/2 flex-col items-center">
              <p className="text-sm font-bold">Pending Amount</p>
              <div className="mt-2 flex items-center gap-1">
                <p className="text-2xl">
                  {(redeemRequest ?? [])
                    .filter(
                      (item) => item.unlock_at > new Date().getTime() / 1000,
                    )
                    .reduce(
                      (acc, cur) => acc + ubbnToBaby(Number(cur.amount)),
                      0,
                    )}
                </p>
                <img src={babyLogo} className="h-6 w-6" alt="baby" />
              </div>
            </div>
            <div className="flex w-1/2 flex-col items-center">
              <p className="text-sm font-bold">Available Amount</p>
              <div className="mt-2 flex items-center gap-1">
                <p className="text-2xl">{ubbnToBaby(withdrawalAmount ?? 0)}</p>
                <img src={babyLogo} className="h-6 w-6" alt="baby" />
              </div>
            </div>
            <div className="bot-4 absolute left-1/2 right-1/2 top-4 h-[65%] w-[1px] bg-[#dadada]"></div>
          </div>
        </div>
        {/* <div className="w-full bg-[#f9f9f9] p-3 dark:bg-[#252525]">
          <p className="text-xl font-semibold">Rewards</p>
          <div className="relative mx-auto flex w-full items-center justify-between gap-1 p-2">
            <div className="flex w-1/2 flex-col items-center">
              <p className="text-sm font-bold">BTC Staking Reward</p>
              <div className="mt-2 flex items-center gap-1">
                <p className="text-2xl">{bech32Address === orderOwner ? btcReward != undefined ? maxDecimals(ubbnToBaby(btcReward), 6) : 0 : 0}</p>
                <img src={babyLogo} className="h-6 w-6" alt="baby" />
              </div>
            </div>
            <div className="flex w-1/2 flex-col items-center">
              <p className="text-sm font-bold">BABY Staking Reward(todo)</p>
              <div className="mt-2 flex items-center gap-1">
                <p className="text-2xl">{10}</p>
                <img src={babyLogo} className="h-6 w-6" alt="baby" />
              </div>
            </div>
            <div className="bot-4 absolute left-1/2 right-1/2 top-4 h-[65%] w-[1px] bg-[#dadada]"></div>
          </div>
        </div> */}
      </div>
    </div>
  );
};
