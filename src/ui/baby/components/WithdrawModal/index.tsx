
import { getNetworkConfigBBN } from "@/ui/common/config/network/bbn";
// import { DEFAULT_CONFIRMATION_DEPTH } from "@/ui/common/constants";
// import { useNetworkInfo } from "@/ui/common/hooks/client/api/useNetworkInfo";

import { LoadingModal } from "../../components/LoadingModal";
import { SuccessModal } from "../../components/SuccessModal";
import { useWithdrawState } from "../../state/WithdrawState";
import { PreviewModal } from "./PreviewModel";

export function WithdrawModal() {
  const { step, closePreview, submitForm, withdrawalAmount, feeAmount } = useWithdrawState();
  const { coinSymbol } = getNetworkConfigBBN();
//   const { data: networkInfo } = useNetworkInfo();
//   const confirmationDepth =
//     networkInfo?.params.btcEpochCheckParams?.latestParam
//       ?.btcConfirmationDepth || DEFAULT_CONFIRMATION_DEPTH;
//   const processingHours = Math.ceil(confirmationDepth / 6);
//   const processingHourLabel = processingHours === 1 ? "hour" : "hours";
//   const warnings = [
//     `The staking transaction may take up to ~${processingHours} ${processingHourLabel} to process. Funds will not be deducted instantly; a sufficient available balance must be maintained until the transaction is confirmed and the deduction is finalized.`,
//   ];

  return (
    <>
      {step.name === "preview" && step.data && (
        <PreviewModal withdrawAmount={withdrawalAmount ?? 0} coinSymbol={coinSymbol}
        submitButton="Withdraw"
        onSubmit={submitForm}
        onClose={closePreview}
        feeAmount={feeAmount}
      />
      )}
      {step.name === "signing" && (
        <LoadingModal
          title="Signing in progress"
          description="Please sign the transaction in your wallet to continue"
        />
      )}
      {step.name === "loading" && (
        <LoadingModal
          title="Processing"
          description="Babylon Genesis is processing your withdraw request"
        />
      )}
      {step.name === "success" && (
        <SuccessModal
          title="Your BABY withdraw request has been submitted"
          description="Stakes activate within ~1 hour. Until then, keep the staked amount in your wallet to ensure successful processing."
          onClose={() => {
            closePreview();
            // reset();
          }}
        />
      )}
    </>
  );
}
