import { type PropsWithChildren, useCallback, useMemo, useState } from "react";
import { number, object, ObjectSchema, ObjectShape } from "yup";
import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import { toUtf8 } from "@cosmjs/encoding";

import babylon from "@/infrastructure/babylon";
import { useValidatorService } from "@/ui/baby/hooks/services/useValidatorService";
import { useWalletService } from "@/ui/baby/hooks/services/useWalletService";
import { validateDecimalPoints } from "@/ui/common/components/Staking/Form/validation/validation";
import { useError } from "@/ui/common/context/Error/ErrorProvider";
import { usePrice } from "@/ui/common/hooks/client/api/usePrices";
import { useLogger } from "@/ui/common/hooks/useLogger";
import { MultistakingFormFields } from "@/ui/common/state/MultistakingState";
import {
  createBalanceValidator,
  createMinAmountValidator,
  babyToUbbn,
} from "@/ui/common/utils/bbn";
import { createStateUtils } from "@/ui/common/utils/createStateUtils";
import {
  formatBabyStakingAmount,
  formatNumber,
} from "@/ui/common/utils/formTransforms";
import { useHealthCheck } from "@/ui/common/hooks/useHealthCheck";
import { GEO_BLOCK_MESSAGE } from "@/ui/common/types/services/healthCheck";
import { useBbnTransaction } from "@/ui/common/hooks/client/rpc/mutation/useBbnTransaction";
import { useCosmosWallet } from "@/ui/common/context/wallet/CosmosWalletProvider";
import { ORDER_ADDRESS } from "@/ui/common/constants";

import { usePendingOperationsService } from "../hooks/services/usePendingOperationsService";

const MIN_STAKING_AMOUNT = 0.01;

export interface FormData {
  amount: number;
  feeAmount: number;
}

interface PreviewData {
  amount: number;
  feeAmount: number;
}

interface Step<K extends string, D = never> {
  name: K;
  data?: D;
}

type StakingStep =
  | Step<"initial">
  | Step<"preview", PreviewData>
  | Step<"signing">
  | Step<"loading">
  | Step<"success", { txHash: string }>;

interface StakingState {
  loading: boolean;
  formSchema: any;
  step: StakingStep;
  availableBalance: number;
  babyPrice: number;
  fields: string[];
  showPreview(data: FormData): void;
  closePreview(): void;
  submitForm(): Promise<void>;
  resetForm(): void;
  calculateFee: (params: Omit<FormData, "feeAmount">) => Promise<number>;
  disabled?: {
    title: string;
    message: string;
  };
}

const { StateProvider, useState: useStakingState } =
  createStateUtils<StakingState>({
    loading: true,
    formSchema: null,
    step: { name: "initial" },
    availableBalance: 0,
    babyPrice: 0,
    fields: [],
    calculateFee: async () => 0,
    showPreview: () => {},
    closePreview: () => {},
    submitForm: async () => {},
    resetForm: () => {},
    disabled: undefined,
  });

function StakingState({ children }: PropsWithChildren) {
  const [step, setStep] = useState<StakingStep>({ name: "initial" });

  const { signBbnTx, sendBbnTx, estimateBbnGasFee } = useBbnTransaction();
  const { loading } = useValidatorService();
  const { isGeoBlocked } = useHealthCheck();
  const { balance } = useWalletService();
  const { handleError } = useError();
  const { bech32Address } = useCosmosWallet();
  const logger = useLogger();
  const babyPrice = usePrice("BABY");

  const minAmountValidator = useMemo(
    () => createMinAmountValidator(MIN_STAKING_AMOUNT),
    [],
  );
  // Subtract the pending stake amount from the balance
  const { getTotalPendingStake } = usePendingOperationsService();
  const availableBalance = balance - getTotalPendingStake();

  const balanceValidator = useMemo(
    () => createBalanceValidator(availableBalance),
    [availableBalance],
  );

  const isDisabled = useMemo(() => {
    if (isGeoBlocked) {
      return {
        title: "Unavailable In Your Region",
        message: GEO_BLOCK_MESSAGE,
      };
    }
  }, [isGeoBlocked]);

  const fieldSchemas = useMemo(
    () =>
      [
        {
          field: "amount",
          schema: number()
            .transform(formatBabyStakingAmount)
            .typeError("Staking amount must be a valid number")
            .required("Enter BABY Amount to Stake")
            .moreThan(0, "Staking amount must be greater than 0")
            .test(
              "invalidMinAmount",
              `Minimum staking amount is ${MIN_STAKING_AMOUNT} BABY`,
              (_, context) => minAmountValidator(context.originalValue),
            )
            .test(
              "invalidBalance",
              "Staking Amount Exceeds Available Balance",
              (_, context) => balanceValidator(context.originalValue),
            )
            .test(
              "invalidFormat",
              "Staking amount must have no more than 6 decimal points",
              (_, context) => validateDecimalPoints(context.originalValue, 6),
            ),
        },
        {
          field: "feeAmount",
          schema: number()
            .transform(formatNumber)
            .optional()
            .test(
              "invalidBalance",
              "Fee Amount Exceeds Balance",
              (value = 0) => {
                const valueInMicroBaby = BigInt(Math.floor(value));
                return valueInMicroBaby <= availableBalance;
              },
            ),
        },
      ] as const,
    [availableBalance, minAmountValidator, balanceValidator],
  );

  const formSchema = useMemo(() => {
    const shape = fieldSchemas.reduce(
      (map, formItem) => ({ ...map, [formItem.field]: formItem.schema }),
      {} as ObjectShape,
    );

    return object()
      .shape(shape)
      .required() as ObjectSchema<MultistakingFormFields>;
  }, [fieldSchemas]);

  const fields = useMemo(
    () => fieldSchemas.map((schema) => schema.field),
    [fieldSchemas],
  );

  const showPreview = useCallback(({ amount, feeAmount }: FormData) => {
    const formData: PreviewData = {
      amount,
      feeAmount,
    };
    setStep({ name: "preview", data: formData });
  }, []);

  const closePreview = useCallback(() => {
    setStep({ name: "initial" });
  }, []);

  const createStakeMsg = useCallback(
    (amount: number) => {
      const msg: MsgExecuteContractEncodeObject = {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: {
          sender: bech32Address,
          contract: ORDER_ADDRESS,
          msg: toUtf8(
            JSON.stringify({
              stake: {},
            }),
          ),
          funds: [
            {
              denom: "ubbn",
              amount: amount.toString(),
            },
          ],
        },
      };
      return msg;
    },
    [bech32Address],
  );

  const submitForm = useCallback(async () => {
    if (step.name !== "preview" || !step.data) return;

    try {
      setStep({ name: "signing" });
      const amount = step.data.amount;
      const msg = createStakeMsg(amount);

      setStep({ name: "loading" });
      const result = await sendBbnTx(await signBbnTx(msg));
      logger.info("Baby Staking: Stake", {
        txHash: result?.transactionHash,
      });
      setStep({ name: "success", data: { txHash: result?.transactionHash } });
    } catch (error: any) {
      handleError({ error });
      logger.error(error);
      setStep({ name: "initial" });
    }
  }, [step, logger, handleError, sendBbnTx, signBbnTx, createStakeMsg]);

  const calculateFee = useCallback(
    async ({ amount }: Omit<FormData, "feeAmount">) => {
      try {
        const msg = createStakeMsg(babyToUbbn(amount));
        const result = await estimateBbnGasFee(msg);
        return result.amount.reduce(
          (sum, { amount }) => sum + Number(amount),
          0,
        );
      } catch (error: any) {
        handleError({ error });
        logger.error(error);
        return 0;
      }
    },
    [handleError, logger, estimateBbnGasFee, createStakeMsg],
  );

  const resetForm = useCallback(() => {
    setStep({ name: "initial" });
  }, []);

  const context = useMemo(() => {
    const displayBalance = babylon.utils.ubbnToBaby(availableBalance);
    return {
      loading,
      step,
      availableBalance: displayBalance,
      formSchema,
      fields,
      babyPrice,
      calculateFee,
      showPreview,
      submitForm,
      resetForm,
      closePreview,
      disabled: isDisabled,
    };
  }, [
    availableBalance,
    loading,
    step,
    formSchema,
    fields,
    babyPrice,
    calculateFee,
    showPreview,
    submitForm,
    resetForm,
    closePreview,
    isDisabled,
  ]);

  return <StateProvider value={context}>{children}</StateProvider>;
}

export { StakingState, useStakingState };
