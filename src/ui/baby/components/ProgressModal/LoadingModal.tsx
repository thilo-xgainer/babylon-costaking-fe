import babyLogo from "@/ui/common/assets/baby-token.svg";
import { LoadingIcon } from "@/ui/icons/LoadingIcon";
import { InfoIcon } from "lucide-react";

interface Props {
  isFunding: boolean;
}

export const LoadingModal: React.FC<Props> = ({ isFunding }) => {
  return (
    <div className="flex w-[412px] flex-col items-center p-8">
      <LoadingIcon className="mb-8 text-brand-text-title" />
      <div className="flex flex-col items-center gap-4">
        <p>Transcastion in Progress</p>
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
        <div className="flex w-full items-center gap-2 rounded-lg border-[1px] border-success-border-subtle bg-success-surface-subtle px-4 py-2">
          <InfoIcon className="h-4 w-4 text-success-text-body" />
          <p className="text-sm text-success-text-body">
            Please confirm the transaction in your wallet.
          </p>
        </div>
      </div>
    </div>
  );
};
