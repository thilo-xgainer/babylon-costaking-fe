import { useRedeemState } from "@/ui/baby/state/RedeemState";
import { useWithdrawState } from "@/ui/baby/state/WithdrawState";
import babyLogo from "@/ui/common/assets/baby-token.svg";
import { ubbnToBaby } from "@/ui/common/utils/bbn";

export const StakeInfo = () => {
  const { availableBalance: stakedAmount } = useRedeemState();
  const { withdrawalAmount, redeemRequest } = useWithdrawState();
  return (
    <div>
      <p>Your Staked Info</p>
      <div className="flex w-full flex-col items-start gap-3 p-4">
        <div className="w-full bg-[#f9f9f9] p-3">
          <p className="text-xl font-semibold">Stake</p>
          <div className="relative mx-auto flex w-full items-center justify-between gap-1 p-2">
            <div className="flex w-1/2 flex-col items-center">
              <p className="font-bold text-sm">Staked Amount</p>
              <div className="flex items-center gap-1 mt-2">
                <p className="text-2xl">{stakedAmount}</p>
                <img src={babyLogo} className="h-6 w-6" alt="baby" />
              </div>
            </div>
            <div className="flex w-1/2 flex-col items-center">
              <p className="font-bold text-sm">Pending Amount</p>
              <div className="flex items-center gap-1 mt-2">
                <p className="text-2xl">{10}</p>
                <img src={babyLogo} className="h-6 w-6" alt="baby" />
              </div>
            </div>
            <div className="bot-4 absolute left-1/2 right-1/2 top-4 h-[65%] w-[1px] bg-[#dadada]"></div>
          </div>
        </div>
        <div className="w-full bg-[#f9f9f9] p-3">
          <p className="text-xl font-semibold">Withdraw</p>
          <div className="relative mx-auto flex w-full items-center justify-between gap-1 p-2">
            <div className="flex w-1/2 flex-col items-center">
              <p className="font-bold text-sm">Pending Amount</p>
              <div className="flex items-center gap-1 mt-2">
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
              <p className="font-bold text-sm">Available Amount</p>
              <div className="flex items-center gap-1 mt-2">
                <p className="text-2xl">{ubbnToBaby(withdrawalAmount ?? 0)}</p>
                <img src={babyLogo} className="h-6 w-6" alt="baby" />
              </div>
            </div>
            <div className="bot-4 absolute left-1/2 right-1/2 top-4 h-[65%] w-[1px] bg-[#dadada]"></div>
          </div>
        </div>
        <div className="w-full bg-[#f9f9f9] p-3">
          <p className="text-xl font-semibold">Rewards</p>
          <div className="relative mx-auto flex w-full items-center justify-between gap-1 p-2">
            <div className="flex w-1/2 flex-col items-center">
              <p className="font-bold text-sm">BTC Staking Reward</p>
              <div className="flex items-center gap-1 mt-2">
                <p className="text-2xl">
                  10
                </p>
                <img src={babyLogo} className="h-6 w-6" alt="baby" />
              </div>
            </div>
            <div className="flex w-1/2 flex-col items-center">
              <p className="font-bold text-sm">BABY Staking Reward</p>
              <div className="flex items-center gap-1 mt-2">
                <p className="text-2xl">{10}</p>
                <img src={babyLogo} className="h-6 w-6" alt="baby" />
              </div>
            </div>
            <div className="bot-4 absolute left-1/2 right-1/2 top-4 h-[65%] w-[1px] bg-[#dadada]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
