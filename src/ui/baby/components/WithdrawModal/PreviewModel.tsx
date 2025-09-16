import { ResponsiveDialog } from "@/ui/common/components/Modals/ResponsiveDialog";
import { ubbnToBaby } from "@/ui/common/utils/bbn";
import {
  Button,
  CloseIcon,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@babylonlabs-io/core-ui";
import type { JSX, PropsWithChildren } from "react";

interface SubmitModalProps {
  feeAmount: number;
  coinSymbol: string;
  withdrawAmount: number;
  cancelButton?: string | JSX.Element;
  submitButton?: string | JSX.Element;
  onClose?: () => void;
  onSubmit?: () => void;
}

export const PreviewModal = ({
  feeAmount,
  coinSymbol,
  withdrawAmount,
  cancelButton = "Cancel",
  submitButton = "Submit",
  onClose,
  onSubmit,
}: PropsWithChildren<SubmitModalProps>) => (
  <ResponsiveDialog open={true} onClose={onClose}>
    <DialogHeader title="">
      <div className="flex items-center justify-between">
        <p className="text-2xl">Preview</p>
        <Button className="p-3" variant="outlined" onClick={onClose}>
          <CloseIcon />
        </Button>
      </div>
    </DialogHeader>
    <DialogBody className="py-10 text-center text-accent-primary">
      <div className="flex w-full items-center justify-between">
        <p>Withdraw Amount:</p>
        <p>
          {ubbnToBaby(withdrawAmount)} {coinSymbol}
        </p>
      </div>
      <div className="flex w-full items-center justify-between">
        <p>Fee Amount:</p>
        <p>
          {ubbnToBaby(feeAmount)} {coinSymbol}
        </p>
      </div>

      {/* <Text as="div">{children}</Text> */}
    </DialogBody>

    <DialogFooter className="flex gap-4">
      {cancelButton && (
        <Button variant="outlined" className="flex-1" onClick={onClose}>
          {cancelButton}
        </Button>
      )}

      {submitButton && (
        <Button variant="contained" className="flex-1" onClick={onSubmit}>
          {submitButton}
        </Button>
      )}
    </DialogFooter>
  </ResponsiveDialog>
);
