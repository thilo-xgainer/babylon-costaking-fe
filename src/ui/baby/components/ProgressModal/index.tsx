import useOutsideClick from "@/hooks/useClickOutside";
import React, { useRef } from "react";
import { LoadingModal } from "./LoadingModal";
import { SuccessModal } from "./SuccessModal";
import { ErrorModal } from "./ErrorModal";
import { TransactionStep } from "@/types/type";

interface ModalProps {
  step: TransactionStep;
  isFunding: boolean;
  tryAgain: () => void;
  closeModal: () => void;
}

export const ProgressModal: React.FC<ModalProps> = ({
  step,
  isFunding,
  tryAgain,
  closeModal,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick([cardRef], () => {
    closeModal();
  });
  return (
    <div className="fixed left-0 top-0 z-20 flex h-screen w-screen items-center justify-center bg-[#eeeeeea6]">
      <div className="bg-[#f9f9f9]" ref={cardRef}>
        {step.name === "signing" || step.name === "progressing" ? (
          <LoadingModal isFunding={isFunding} />
        ) : null}
        {step.name === "success" ? (
          <SuccessModal
            isFunding={isFunding}
            action="Create Order"
            txHash={step.txHash}
          />
        ) : null}
        {step.name === "error" || step.name === "rejected" ? (
          <ErrorModal
            isFunding={isFunding}
            action="Create Order"
            cancel={closeModal}
            tryAgain={tryAgain}
          />
        ) : null}
      </div>
    </div>
  );
};
