import { Form } from "@babylonlabs-io/core-ui";

import { AmountField } from "@/ui/baby/components/AmountField";
import { FeeField } from "@/ui/baby/components/FeeField";
import { useStakingState } from "@/ui/baby/state/StakingState";
import { StakingModal } from "@/ui/baby/widgets/StakingModal";
import { SubmitButton } from "@/ui/baby/widgets/SubmitButton";
import { FormAlert } from "@/ui/common/components/Multistaking/MultistakingForm/FormAlert";

interface FormFields {
  amount: number;
  feeAmount: number;
}

interface StakingFormProps {
  isGeoBlocked?: boolean;
}

export default function StakingForm({
  isGeoBlocked = false,
}: StakingFormProps) {
  const {
    loading,
    formSchema,
    availableBalance,
    babyPrice,
    calculateFee,
    showPreview,
    disabled,
  } = useStakingState();

  const handlePreview = ({ amount, feeAmount }: FormFields) => {
    showPreview({ amount, feeAmount });
  };

  return (
    <Form
      schema={formSchema}
      className="flex flex-col gap-2"
      onSubmit={handlePreview}
    >
      <AmountField balance={availableBalance} price={babyPrice} />
      {/* <ValidatorField /> */}
      <FeeField babyPrice={babyPrice} calculateFee={calculateFee} />

      <SubmitButton disabled={loading} isGeoBlocked={isGeoBlocked} />
      <StakingModal />
      <FormAlert {...disabled} />
    </Form>
  );
}
