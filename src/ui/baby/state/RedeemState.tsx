import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { number, object, ObjectSchema, ObjectShape } from "yup";
import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import { toUtf8 } from "@cosmjs/encoding";
import { useParams } from "react-router";

import babylon from "@/infrastructure/babylon";
import { validateDecimalPoints } from "@/ui/common/components/Staking/Form/validation/validation";
import { useError } from "@/ui/common/context/Error/ErrorProvider";
import { usePrice } from "@/ui/common/hooks/client/api/usePrices";
import { useLogger } from "@/ui/common/hooks/useLogger";
import { MultistakingFormFields } from "@/ui/common/state/MultistakingState";
import { createMinAmountValidator, babyToUbbn } from "@/ui/common/utils/bbn";
import { createStateUtils } from "@/ui/common/utils/createStateUtils";
import {
  formatBabyStakingAmount,
  formatNumber,
} from "@/ui/common/utils/formTransforms";
import { useHealthCheck } from "@/ui/common/hooks/useHealthCheck";
import { GEO_BLOCK_MESSAGE } from "@/ui/common/types/services/healthCheck";
import { useBbnTransaction } from "@/ui/common/hooks/client/rpc/mutation/useBbnTransaction";
import { useCosmosWallet } from "@/ui/common/context/wallet/CosmosWalletProvider";
import { useCosmwasmQuery } from "@/ui/common/hooks/client/useCosmwasmQuery";

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

type RedeemStep =
  | Step<"initial">
  | Step<"preview", PreviewData>
  | Step<"signing">
  | Step<"loading">
  | Step<"success", { txHash: string }>;

interface RedeemState {
  //   loading: boolean;
  formSchema: any;
  step: RedeemStep;
  availableBalance: number;
  babyPrice: number;
  fields: string[];
  exchangeRate: number;
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

const { StateProvider, useState: useRedeemState } =
  createStateUtils<RedeemState>({
    // loading: true,
    formSchema: null,
    step: { name: "initial" },
    availableBalance: 0,
    babyPrice: 0,
    fields: [],
    exchangeRate: 0,
    calculateFee: async () => 0,
    showPreview: () => {},
    closePreview: () => {},
    submitForm: async () => {},
    resetForm: () => {},
    disabled: undefined,
  });

function RedeemState({ children }: PropsWithChildren) {
  const [step, setStep] = useState<RedeemStep>({ name: "initial" });
  const { orderAddress } = useParams();
  const { signBbnTx, sendBbnTx, estimateBbnGasFee } = useBbnTransaction();
  const { isGeoBlocked } = useHealthCheck();
  const { handleError } = useError();
  const { bech32Address } = useCosmosWallet();
  const { data: stakedAmount = 0, refetch: refetchStakedAmount } =
    useCosmwasmQuery({
      contractAddress: orderAddress!,
      queryMsg: {
        get_user_staked: {
          user: bech32Address,
        },
      },
      options: { enabled: !!orderAddress },
    });
  const { data: exchangeRate } = useCosmwasmQuery({
    contractAddress: orderAddress!,
    queryMsg: {
      get_exchange_rate: {},
    },
    options: { enabled: !!orderAddress },
  });

  const logger = useLogger();
  const babyPrice = usePrice("BABY");

  const minAmountValidator = useMemo(
    () => createMinAmountValidator(MIN_STAKING_AMOUNT),
    [],
  );
  // Subtract the pending stake amount from the balance
  const availableBalance = stakedAmount;

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
            .typeError("Redeem amount must be a valid number")
            .required("Enter BABY Amount to Redeem")
            .moreThan(0, "Redeem amount must be greater than 0")
            .lessThan(
              stakedAmount,
              "Redeem amount must be less than staked amount",
            )
            .test(
              "invalidMinAmount",
              `Minimum redeem amount is ${MIN_STAKING_AMOUNT} BABY`,
              (_, context) => minAmountValidator(context.originalValue),
            )
            .test(
              "invalidFormat",
              "Redeem amount must have no more than 6 decimal points",
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
    [availableBalance, minAmountValidator, stakedAmount],
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
    console.log("formData: ", formData);
    setStep({ name: "preview", data: formData });
  }, []);

  const closePreview = useCallback(() => {
    setStep({ name: "initial" });
  }, []);

  const createRedeemMsg = useCallback(
    (amount: number) => {
      const msg: MsgExecuteContractEncodeObject = {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: {
          sender: bech32Address,
          contract: orderAddress,
          msg: toUtf8(
            JSON.stringify({
              un_stake: {
                amount: amount.toString(),
              },
            }),
          ),
          funds: [],
        },
      };
      return msg;
    },
    [bech32Address, orderAddress],
  );

  const submitForm = useCallback(async () => {
    if (step.name !== "preview" || !step.data) return;

    try {
      setStep({ name: "signing" });
      const amount = step.data.amount;
      const msg = createRedeemMsg(amount);

      setStep({ name: "loading" });
      const result = await sendBbnTx(await signBbnTx(msg));
      logger.info("Baby Staking: Redeem", {
        txHash: result?.transactionHash,
      });
      setStep({ name: "success", data: { txHash: result?.transactionHash } });
      await refetchStakedAmount();
    } catch (error: any) {
      handleError({ error });
      logger.error(error);
      setStep({ name: "initial" });
    }
  }, [
    step,
    logger,
    handleError,
    sendBbnTx,
    signBbnTx,
    createRedeemMsg,
    refetchStakedAmount,
  ]);

  const calculateFee = useCallback(
    async ({ amount }: Omit<FormData, "feeAmount">) => {
      try {
        const msg = createRedeemMsg(babyToUbbn(amount));
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
    [handleError, logger, estimateBbnGasFee, createRedeemMsg],
  );

  useEffect(() => {
    refetchStakedAmount();
  }, [bech32Address, refetchStakedAmount]);

  const resetForm = useCallback(() => {
    setStep({ name: "initial" });
  }, []);

  const context = useMemo(() => {
    const displayBalance = babylon.utils.ubbnToBaby(availableBalance);
    return {
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
      exchangeRate,
    };
  }, [
    availableBalance,
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
    exchangeRate,
  ]);

  return <StateProvider value={context}>{children}</StateProvider>;
}

export { RedeemState, useRedeemState };
