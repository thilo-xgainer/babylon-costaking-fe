import { Form } from "@babylonlabs-io/core-ui";

import { AmountField } from "@/ui/baby/components/AmountField";
import { FeeField } from "@/ui/baby/components/FeeField";
import { SubmitButton } from "@/ui/baby/widgets/SubmitButton";
import { FormAlert } from "@/ui/common/components/Multistaking/MultistakingForm/FormAlert";
import { FormFields } from "@/ui/common/state/StakingState";

import { useRedeemState } from "../../state/RedeemState";
import { RedeemModal } from "../RedeemModal";
export const Redeem = ({
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
  console.log("🚀 ~ Redeem ~ babyPrice:", babyPrice);
  console.log("🚀 ~ Redeem ~ availableBalance:", availableBalance);
  const handlePreview = ({ amount, feeAmount }: FormFields) => {
    showPreview({ amount, feeAmount });
  };

  return (
    <Form
      schema={formSchema}
      className="flex h-[500px] flex-col gap-2"
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
