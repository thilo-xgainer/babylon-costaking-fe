import React from "react";
import babyLogo from "@/ui/common/assets/baby-token.svg";
import { ErrorIcon } from "@/ui/icons/ErrorIcon";
import { InfoIcon } from "lucide-react";

interface Props {
  isFunding: boolean;
  action: string;
  tryAgain: () => void;
  cancel: () => void;
}

export const ErrorModal: React.FC<Props> = ({
  action,
  isFunding,
  cancel,
  tryAgain,
}) => {
  return (
    <div className="flex w-[412px] flex-col items-center p-8">
      <div className="mb-8 rounded-full bg-error-surface-subtle p-[10px]">
        <ErrorIcon className="text-error-text-body" />
      </div>
      <div className="flex w-full flex-col items-center gap-4">
        <p>{action} Cancelled</p>
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
        <div className="flex w-full items-center gap-2 rounded-lg border-[1px] border-error-surface-subtle bg-error-surface-subtle px-4 py-2">
          <InfoIcon className="h-4 w-4 text-error-text-body" />
          <p className="text-sm text-error-text-body">
            You rejected the transaction.
          </p>
        </div>
        <div className="flex w-full items-center justify-between gap-2">
          <div
            onClick={tryAgain}
            className="w-1/2 cursor-pointer rounded-xl bg-brand-surface-default px-5 py-3 text-center text-greyscale-text-negative duration-200 hover:bg-brand-surface-op-sub"
          >
            Try again
          </div>
          <div
            onClick={cancel}
            className="w-1/2 cursor-pointer rounded-xl border-[1px] border-brand-border-subtle bg-brand-surface-super-subtle px-5 py-3 text-center text-brand-text-title duration-200 hover:border-brand-border-default hover:bg-brand-surface-subtle"
          >
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
};
