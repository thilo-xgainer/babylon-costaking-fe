import tbabyLogo from "@/ui/common/assets/baby.png";
import { useWithdrawState } from "@/ui/baby/state/WithdrawState";
import { ubbnToBaby } from "@/ui/common/utils/bbn";
import { timeRemaining } from "@/utils/format";

import { WithdrawModal } from "../WithdrawModal";
import { ClockIcon } from "@/ui/icons/ClockIcon";

export const WithdrawCard = () => {
  const { redeemRequest, withdrawalAmount, showPreview } = useWithdrawState();

  const handlePreview = () => {
    showPreview();
  };
  return (
    <div>
      <div className="bg-[#F9F9F9] dark:bg-[#252525] p-4">
        <p>Withdraw Reqest</p>
        <div className="flex w-full flex-col items-center gap-2">
          {withdrawalAmount && withdrawalAmount > 0 && (
            <div className="flex w-1/2 items-center justify-between bg-[#1b5f79] px-6 py-3">
              <div className="flex items-center gap-1">
                <img src={tbabyLogo} />
                <div className="flex flex-col items-start text-white">
                  <p>{ubbnToBaby(withdrawalAmount)}</p>
                  <p>BABY</p>
                </div>
              </div>
              <WithdrawModal />
              <button
                className="w-[125px] flex cursor-pointer items-center gap-1 bg-[#f0f0f0] p-4 justify-center text-[#547496] hover:opacity-75"
                onClick={handlePreview}
              >
                Withdraw
              </button>
            </div>
          )}
          {redeemRequest
            ?.filter(
              (request) => request.unlock_at > new Date().getTime() / 1000,
            )
            .map((request, index) => (
              <div
                key={index}
                className="flex w-1/2 items-center justify-between bg-[#1b5f79] px-6 py-3"
              >
                <div className="flex items-center gap-1">
                  <img src={tbabyLogo} />
                  <div className="flex flex-col items-start text-white">
                    <p>{ubbnToBaby(Number(request.amount))}</p>
                    <p>BABY</p>
                  </div>
                </div>
                <div className="w-[125px] flex cursor-pointer items-center gap-1 bg-[#f1f1f1] p-4 text-center justify-center text-[#547496]">
                  {timeRemaining(request.unlock_at)} <ClockIcon/>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
