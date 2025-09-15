
import tbabyLogo from "@/ui/common/assets/baby.png";
import { useWithdrawState } from "@/ui/baby/state/WithdrawState";
import { ubbnToBaby } from "@/ui/common/utils/bbn";
import { timeRemaining } from "@/utils/format";
import { ClockIcon } from "@/ui/icons/ClockIcon";

export const WithdrawCard = () => {
  const {redeemRequest, withdrawalAmount} = useWithdrawState()

  return (
    <div>
      <div className="bg-[#F9F9F9] p-4">
        <p>Pending Reqest</p>
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
              <button className="flex cursor-pointer items-center gap-1 bg-[#f0f0f0] p-4 text-center text-[#547496] hover:opacity-75">
                Withdraw
              </button>
            </div>
          )}
          {redeemRequest?.map((request, index) => (
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
              <div className="flex cursor-pointer items-center gap-1 bg-[#f1f1f1] p-4 text-center text-[#547496]">
                {timeRemaining(request.unlock_at)}
                <ClockIcon size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
