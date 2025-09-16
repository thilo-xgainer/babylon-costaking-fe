import { useCallback } from "react";
import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import { toUtf8 } from "@cosmjs/encoding";
import { useParams } from "react-router";

import { ONE_SECOND } from "@/ui/common/constants";
import { useError } from "@/ui/common/context/Error/ErrorProvider";
import { useLogger } from "@/ui/common/hooks/useLogger";
import { useRewardsState } from "@/ui/baby/state/RewardState";
import { retry } from "@/ui/common/utils";
import { useBbnTransaction } from "@/ui/common/hooks/client/rpc/mutation/useBbnTransaction";
import { useBbnQuery } from "@/ui/common/hooks/client/rpc/queries/useBbnQuery";

const MAX_RETRY_ATTEMPTS = 3;

export const useRewardsService = () => {
  const {
    bbnAddress,
    openRewardModal,
    closeRewardModal,
    openProcessingModal,
    closeProcessingModal,
    setTransactionHash,
    refetchRewardBalance,
    setProcessing,
    setTransactionFee,
  } = useRewardsState();
  const { balanceQuery } = useBbnQuery();
  const { handleError } = useError();
  const logger = useLogger();
  const { estimateBbnGasFee, sendBbnTx, signBbnTx } = useBbnTransaction();
  const { orderAddress } = useParams();

  const createWithdrawRewardMsg = useCallback(
    (bech32Address: string) => {
      const msg: MsgExecuteContractEncodeObject = {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: {
          sender: bech32Address,
          contract: orderAddress,
          msg: toUtf8(
            JSON.stringify({
              claim_btc_reward: {},
            }),
          ),
          funds: [],
        },
      };
      return msg;
    },
    [orderAddress],
  );

  /**
   * Estimates the gas fee for claiming rewards.
   * @returns {Promise<number>} The gas fee for claiming rewards.
   */
  const estimateClaimRewardsGas = useCallback(async (): Promise<number> => {
    const withdrawRewardMsg = createWithdrawRewardMsg(bbnAddress);
    const gasFee = await estimateBbnGasFee(withdrawRewardMsg);
    return gasFee.amount.reduce((acc, coin) => acc + Number(coin.amount), 0);
  }, [bbnAddress, estimateBbnGasFee, createWithdrawRewardMsg]);

  const showPreview = useCallback(async () => {
    setTransactionFee(0);
    setProcessing(true);
    openRewardModal();
    try {
      const fee = await estimateClaimRewardsGas();
      setTransactionFee(fee);
    } catch (error: any) {
      logger.error(error, {
        tags: { bbnAddress },
      });
      handleError({ error });
    } finally {
      setProcessing(false);
    }
  }, [
    estimateClaimRewardsGas,
    setProcessing,
    openRewardModal,
    setTransactionFee,
    logger,
    handleError,
    bbnAddress,
  ]);

  /**
   * Claims the rewards from the user's account.
   */
  const claimRewards = useCallback(async () => {
    closeRewardModal();
    setProcessing(true);
    openProcessingModal();

    try {
      const msg = createWithdrawRewardMsg(bbnAddress);
      const signedTx = await signBbnTx(msg);
      const result = await sendBbnTx(signedTx);

      if (result?.transactionHash) {
        setTransactionHash(result.transactionHash);
      }

      await refetchRewardBalance();
      const initialBalance = balanceQuery.data || 0;
      await retry(
        () => balanceQuery.refetch().then((res) => res.data),
        (value) => value !== initialBalance,
        ONE_SECOND,
        MAX_RETRY_ATTEMPTS,
      );
    } catch (error: any) {
      closeProcessingModal();
      setTransactionHash("");
      logger.error(error, {
        tags: { bbnAddress },
      });
      handleError({ error });
    } finally {
      setProcessing(false);
    }
  }, [
    closeRewardModal,
    setProcessing,
    openProcessingModal,
    bbnAddress,
    signBbnTx,
    sendBbnTx,
    refetchRewardBalance,
    balanceQuery,
    setTransactionHash,
    closeProcessingModal,
    handleError,
    logger,
    createWithdrawRewardMsg,
  ]);

  return {
    claimRewards,
    showPreview,
  };
};
