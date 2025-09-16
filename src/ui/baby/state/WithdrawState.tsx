import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import { toUtf8 } from "@cosmjs/encoding";
import { useParams } from "react-router";

import { useError } from "@/ui/common/context/Error/ErrorProvider";
import { usePrice } from "@/ui/common/hooks/client/api/usePrices";
import { useLogger } from "@/ui/common/hooks/useLogger";
import { createStateUtils } from "@/ui/common/utils/createStateUtils";
import { useHealthCheck } from "@/ui/common/hooks/useHealthCheck";
import { GEO_BLOCK_MESSAGE } from "@/ui/common/types/services/healthCheck";
import { useBbnTransaction } from "@/ui/common/hooks/client/rpc/mutation/useBbnTransaction";
import { useCosmosWallet } from "@/ui/common/context/wallet/CosmosWalletProvider";
import { useCosmwasmQuery } from "@/ui/common/hooks/client/useCosmwasmQuery";

export interface FormData {
  amount: number;
  feeAmount: number;
}

interface PreviewData {
  feeAmount: number;
}

type PendingRequest = {
  amount: string;
  unlock_at: number;
};

interface Step<K extends string, D = never> {
  name: K;
  data?: D;
}

type WithdrawStep =
  | Step<"initial">
  | Step<"preview", PreviewData>
  | Step<"signing">
  | Step<"loading">
  | Step<"success", { txHash: string }>;

interface WithdrawState {
  //   loading: boolean;
  step: WithdrawStep;
  babyPrice: number;
  redeemRequest: PendingRequest[] | undefined;
  withdrawalAmount: number | undefined;
  showPreview(data: FormData): void;
  closePreview(): void;
  submitForm(): Promise<void>;
  resetForm(): void;
  feeAmount: number;
  disabled?: {
    title: string;
    message: string;
  };
}

const { StateProvider, useState: useWithdrawState } =
  createStateUtils<WithdrawState>({
    // loading: true,
    step: { name: "initial" },
    babyPrice: 0,
    feeAmount: 0,
    redeemRequest: [],
    withdrawalAmount: 0,
    showPreview: () => {},
    closePreview: () => {},
    submitForm: async () => {},
    resetForm: () => {},
    disabled: undefined,
  });

function WithdrawState({ children }: PropsWithChildren) {
  const [step, setStep] = useState<WithdrawStep>({ name: "initial" });
  const { orderAddress } = useParams();
  const [feeAmount, setFeeAmount] = useState<number>(0);
  const { signBbnTx, sendBbnTx, estimateBbnGasFee } = useBbnTransaction();
  const { isGeoBlocked } = useHealthCheck();
  const { handleError } = useError();
  const { bech32Address } = useCosmosWallet();
  const logger = useLogger();
  const babyPrice = usePrice("BABY");
  const { data: redeemRequest, refetch: refetchRedeemRequest } =
    useCosmwasmQuery<PendingRequest[]>({
      contractAddress: orderAddress!,
      queryMsg: {
        get_redeem_request: {
          user: bech32Address,
        },
      },
      options: { enabled: !!orderAddress },
    });
  const { data: withdrawalAmount, refetch: refetcWithdrawlAmount } =
    useCosmwasmQuery<number>({
      contractAddress: orderAddress!,
      queryMsg: {
        get_withdrawal_amount: {
          user: bech32Address,
        },
      },
      options: { enabled: !!orderAddress },
    });

  const isDisabled = useMemo(() => {
    if (isGeoBlocked) {
      return {
        title: "Unavailable In Your Region",
        message: GEO_BLOCK_MESSAGE,
      };
    }
  }, [isGeoBlocked]);

  const showPreview = useCallback(() => {
    const formData: PreviewData = {
      feeAmount,
    };
    setStep({ name: "preview", data: formData });
  }, [feeAmount]);

  const closePreview = useCallback(() => {
    setStep({ name: "initial" });
  }, []);

  const createWithdrawMsg = useCallback(() => {
    const msg: MsgExecuteContractEncodeObject = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: {
        sender: bech32Address,
        contract: orderAddress,
        msg: toUtf8(
          JSON.stringify({
            withdraw: {},
          }),
        ),
        funds: [],
      },
    };
    return msg;
  }, [bech32Address, orderAddress]);

  const submitForm = useCallback(async () => {
    if (step.name !== "preview" || !step.data) return;

    try {
      setStep({ name: "signing" });
      const msg = createWithdrawMsg();

      setStep({ name: "loading" });
      const result = await sendBbnTx(await signBbnTx(msg));
      logger.info("Baby Staking: Withdraw", {
        txHash: result?.transactionHash,
      });
      setStep({ name: "success", data: { txHash: result?.transactionHash } });
    } catch (error: any) {
      handleError({ error });
      logger.error(error);
      setStep({ name: "initial" });
    }
  }, [step, logger, handleError, sendBbnTx, signBbnTx, createWithdrawMsg]);

  useEffect(() => {
    let isMounted = true;
    if (withdrawalAmount && withdrawalAmount > 0) {
      (async () => {
        try {
          const msg = createWithdrawMsg();
          const result = await estimateBbnGasFee(msg);
          const fee = result.amount.reduce(
            (sum, { amount }) => sum + Number(amount),
            0,
          );
          if (isMounted) setFeeAmount(fee);
        } catch (error: any) {
          handleError({ error });
          logger.error(error);
          if (isMounted) setFeeAmount(0);
        }
      })();
    }
    return () => {
      isMounted = false;
    };
  }, [
    handleError,
    logger,
    estimateBbnGasFee,
    createWithdrawMsg,
    withdrawalAmount,
  ]);

  const resetForm = useCallback(() => {
    setStep({ name: "initial" });
  }, []);

  useEffect(() => {
    refetchRedeemRequest();
    refetcWithdrawlAmount();
  }, [bech32Address]);

  const context = useMemo(() => {
    return {
      step,
      babyPrice,
      feeAmount,
      redeemRequest,
      withdrawalAmount,
      showPreview,
      submitForm,
      resetForm,
      closePreview,
      disabled: isDisabled,
    };
  }, [
    step,
    babyPrice,
    feeAmount,
    redeemRequest,
    withdrawalAmount,
    showPreview,
    submitForm,
    resetForm,
    closePreview,
    isDisabled,
  ]);

  return <StateProvider value={context}>{children}</StateProvider>;
}

export { WithdrawState, useWithdrawState };
