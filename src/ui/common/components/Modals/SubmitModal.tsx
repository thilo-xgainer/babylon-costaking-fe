import {
  Button,
  DialogBody,
  DialogFooter,
  Heading,
  Loader,
  Text,
} from "@babylonlabs-io/core-ui";
import type { JSX, PropsWithChildren } from "react";

import { ResponsiveDialog } from "./ResponsiveDialog";

interface SubmitModalProps {
  className?: string;
  processing?: boolean;
  disabled?: boolean;
  open: boolean;
  icon: JSX.Element;
  title: string | JSX.Element;
  cancelButton?: string | JSX.Element;
  submitButton?: string | JSX.Element;
  onClose?: () => void;
  onSubmit?: () => void;
}

export const SubmitModal = ({
  className,
  processing = false,
  disabled = false,
  icon,
  title,
  children,
  open,
  cancelButton = "Cancel",
  submitButton = "Submit",
  onClose,
  onSubmit,
}: PropsWithChildren<SubmitModalProps>) => (
  <ResponsiveDialog className={className} open={open} onClose={onClose}>
    <DialogBody className="py-16 text-center text-accent-primary">
      <div className="mb-6 inline-flex h-20 w-20 items-center justify-center bg-primary-contrast">
        {icon}
      </div>

      <Heading variant="h4" className="mb-4">
        {title}
      </Heading>

      <Text as="div">{children}</Text>
    </DialogBody>

    <DialogFooter className="flex gap-4">
      {cancelButton && (
        <Button variant="outlined" className="flex-1" onClick={onClose}>
          {cancelButton}
        </Button>
      )}

      {submitButton && (
        <Button
          disabled={processing || disabled}
          variant="contained"
          className="flex-1"
          onClick={onSubmit}
        >
          {processing ? (
            <Loader size={16} className="text-white" />
          ) : (
            submitButton
          )}
        </Button>
      )}
    </DialogFooter>
  </ResponsiveDialog>
);
