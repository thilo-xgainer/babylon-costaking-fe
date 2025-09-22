import React from "react";
import babyLogo from "@/ui/common/assets/baby-token.svg";
import { SuccessIcon } from "@/ui/icons/SuccessIcon";

interface Props {
  isFunding: boolean;
  action: string;
  txHash: string;
}

export const SuccessModal: React.FC<Props> = ({
  isFunding,
  action,
  txHash,
}) => {
  return (
    <div className="flex w-[412px] flex-col items-center p-8">
      <div className="mb-8 rounded-full bg-success-surface-subtle p-[10px]">
        <SuccessIcon className="text-success-text-body" />
      </div>
      <div className="flex flex-col items-center gap-4">
        <p>{action} Successful</p>
        {isFunding ? (
          <div className="flex w-full flex-col items-center gap-2 rounded-lg bg-greyscale-surface-subtle-lighter py-4">
            <div className="flex items-center gap-2">
              <p className="text-2xl text-greyscale-text-body">1567</p>
              <img src={babyLogo} className="h-6 w-6" />
            </div>
            <div className="flex px-2 py-1">
              <p className="text-success-surface-lighter">
                <span className="font-bold">17.8%</span> APY
              </p>
            </div>
          </div>
        ) : null}
        <div className="w-full rounded-lg bg-brand-surface-default px-5 py-3 text-center text-greyscale-text-negative">
          Back to Staking
        </div>
        <a
          href={`https://testnet.babylon.explorers.guru/transaction/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer text-blue-500 no-underline hover:text-blue-700 hover:underline"
        >
          View on explorer
        </a>
      </div>
    </div>
  );
};
