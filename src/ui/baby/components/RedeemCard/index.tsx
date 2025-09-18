import { Form } from "@babylonlabs-io/core-ui";

import { AmountField } from "@/ui/baby/components/AmountField";
import { FeeField } from "@/ui/baby/components/FeeField";
import { SubmitButton } from "@/ui/baby/widgets/SubmitButton";
import { FormAlert } from "@/ui/common/components/Multistaking/MultistakingForm/FormAlert";
import { FormFields } from "@/ui/common/state/StakingState";

import { useRedeemState } from "../../state/RedeemState";
import { RedeemModal } from "../RedeemModal";
export const RedeemCard = ({
  isGeoBlocked = false,
}: {
  isGeoBlocked?: boolean;
}) => {
  const {
    formSchema,
    availableBalance,
    babyPrice,
    calculateFee,
    showPreview,
    disabled,
  } = useRedeemState();
  const handlePreview = ({ amount, feeAmount }: FormFields) => {
    showPreview({ amount, feeAmount });
  };

  return (
    <Form
      schema={formSchema}
      className="flex flex-col bg-[#f9f9f9]"
      onSubmit={handlePreview}
    >
      <AmountField balance={availableBalance} price={babyPrice} />
      {/* <ValidatorField /> */}
      <FeeField babyPrice={babyPrice} calculateFee={calculateFee} />

      <SubmitButton isGeoBlocked={isGeoBlocked} />
      <RedeemModal />
      <FormAlert {...disabled} />
    </Form>
  );
};
