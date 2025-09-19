import { LoadingModal } from "../../components/LoadingModal";
import { SuccessModal } from "../../components/SuccessModal";
interface Props {
  step: any;
  closeModal: () => void;
}

export function CreateOrderModal({ step, closeModal }: Props) {
  // const { reset } = useFormContext();
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
      {step && step?.name === "signing" && (
        <LoadingModal
          title="Signing in progress"
          description="Please sign the transaction in your wallet to continue"
        />
      )}
      {step && step?.name === "loading" && (
        <LoadingModal
          title="Processing"
          description="Babylon Genesis is processing your request"
        />
      )}
      {step && step?.name === "success" && (
        <SuccessModal
          title="You create order successfully!"
          description="Stakes activate within ~1 hour. Until then, keep the staked amount in your wallet to ensure successful processing."
          onClose={() => {
            closeModal();
          }}
        />
      )}

      {step && step?.name === "error" && <></>}
    </>
  );
}
