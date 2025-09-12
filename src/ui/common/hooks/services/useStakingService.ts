import { useCallback } from "react";
import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import { toUtf8 } from "@cosmjs/encoding";

import { getDelegationV2 } from "@/ui/common/api/getDelegationsV2";
import {
  MARKETPLACE_CONTRACT_ADDRESS,
  ONE_SECOND,
} from "@/ui/common/constants";
import { useError } from "@/ui/common/context/Error/ErrorProvider";
import { useBTCWallet } from "@/ui/common/context/wallet/BTCWalletProvider";
import { useCosmosWallet } from "@/ui/common/context/wallet/CosmosWalletProvider";
import { ClientError } from "@/ui/common/errors";
import { ERROR_CODES } from "@/ui/common/errors/codes";
import { useLogger } from "@/ui/common/hooks/useLogger";
import { useDelegationV2State } from "@/ui/common/state/DelegationV2State";
import {
  StakingStep,
  useStakingState,
  type FormFields,
} from "@/ui/common/state/StakingState";
import {
  DelegationV2StakingState as DelegationState,
  DelegationV2,
} from "@/ui/common/types/delegationsV2";
import { retry } from "@/ui/common/utils";
import { btcToSatoshi } from "@/ui/common/utils/btc";
import { useValidatorState } from "@/ui/baby/state/ValidatorState";

import { useBbnTransaction } from "../client/rpc/mutation/useBbnTransaction";

import { useTransactionService } from "./useTransactionService";

export function useStakingService() {
  const { setFormData, goToStep, setProcessing, setVerifiedDelegation, reset } =
    useStakingState();
  const { sendBbnTx, signBbnTx } = useBbnTransaction();
  const { refetch: refetchDelegations } = useDelegationV2State();
  const { addDelegation, updateDelegationStatus } = useDelegationV2State();
  const { estimateStakingFee, createDelegationEoi, submitStakingTx } =
    useTransactionService();
  const { handleError } = useError();
  const { publicKeyNoCoord, address: btcAddress } = useBTCWallet();
  const { bech32Address } = useCosmosWallet();
  const { validators } = useValidatorState();
  const logger = useLogger();

  const calculateFeeAmount = useCallback(
    ({
      finalityProviders,
      amount,
      term,
      feeRate,
    }: Omit<FormFields, "feeAmount">) => {
      const eoiInput = {
        finalityProviderPksNoCoordHex: finalityProviders || [],
        stakingAmountSat: btcToSatoshi(amount),
        stakingTimelock: term,
        feeRate: feeRate,
      };
      return estimateStakingFee(eoiInput, feeRate);
    },
    [estimateStakingFee],
  );

  const displayPreview = useCallback(
    (formFields: FormFields) => {
      setFormData(formFields);
      goToStep(StakingStep.PREVIEW);
    },
    [setFormData, goToStep],
  );

  const createEOI = useCallback(
    async ({ finalityProviders, amount, term, feeRate }: FormFields) => {
      try {
        const eoiInput = {
          finalityProviderPksNoCoordHex: finalityProviders || [],
          stakingAmountSat: amount,
          stakingTimelock: term,
          feeRate: feeRate,
        };
        setProcessing(true);

        const createOrderMsg: MsgExecuteContractEncodeObject = {
          typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
          value: {
            sender: bech32Address,
            contract: MARKETPLACE_CONTRACT_ADDRESS,
            msg: toUtf8(
              JSON.stringify({
                create_order: {
                  validator: validators[0].id,
                },
              }),
            ),
            funds: [],
          },
        };

        const res = await sendBbnTx(await signBbnTx(createOrderMsg));
        const orderAddress = res.events
          .find((el) => el.type === "execute")
          ?.attributes?.find((el) => el.key === "_contract_address")?.value;

        if (!orderAddress) {
          throw "One user can create only one order";
        }

        const { stakingTxHash, msg } = await createDelegationEoi(
          eoiInput,
          feeRate,
          orderAddress,
        );

        // Send the transaction
        goToStep(StakingStep.EOI_SEND_BBN);

        const createDelegationMsg: MsgExecuteContractEncodeObject = {
          typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
          value: {
            sender: bech32Address,
            contract: orderAddress,
            msg: toUtf8(
              JSON.stringify({
                create_btc_delegation: {
                  fp_btc_pk_list: msg.value.fpBtcPkList.map((el) =>
                    Buffer.from(el).toString("hex"),
                  ),
                  staker_addr: orderAddress,
                  pop: {
                    btc_sig_type: "BIP322",
                    btc_sig: Buffer.from(msg.value.pop.btcSig).toString("hex"),
                  },
                  btc_pk: Buffer.from(msg.value.btcPk).toString("hex"),
                  staking_time: msg.value.stakingTime,
                  staking_value: msg.value.stakingValue,
                  staking_tx: Buffer.from(msg.value.stakingTx).toString("hex"),
                  slashing_tx: Buffer.from(msg.value.slashingTx).toString(
                    "hex",
                  ),
                  delegator_slashing_sig: Buffer.from(
                    msg.value.delegatorSlashingSig,
                  ).toString("hex"),
                  unbonding_time: msg.value.unbondingTime,
                  unbonding_tx: Buffer.from(msg.value.unbondingTx).toString(
                    "hex",
                  ),
                  unbonding_value: msg.value.unbondingValue,
                  unbonding_slashing_tx: Buffer.from(
                    msg.value.unbondingSlashingTx,
                  ).toString("hex"),
                  delegator_unbonding_slashing_sig: Buffer.from(
                    msg.value.delegatorUnbondingSlashingSig,
                  ).toString("hex"),
                },
              }),
            ),
            funds: [],
          },
        };

        await sendBbnTx(await signBbnTx(createDelegationMsg));

        addDelegation({
          stakingAmount: amount,
          stakingTxHashHex: stakingTxHash,
          startHeight: 0,
          state: DelegationState.INTERMEDIATE_PENDING_VERIFICATION,
        });

        goToStep(StakingStep.VERIFYING);

        const delegation = await retry(
          () => getDelegationV2(stakingTxHash),
          (delegation) => delegation?.state === DelegationState.VERIFIED,
          5 * ONE_SECOND,
        );

        setVerifiedDelegation(delegation as DelegationV2);
        refetchDelegations();
        goToStep(StakingStep.VERIFIED);
        setProcessing(false);
      } catch (error: any) {
        const metadata = {
          userPublicKey: publicKeyNoCoord,
          btcAddress: btcAddress,
          babylonAddress: bech32Address,
        };
        const clientError = new ClientError(
          ERROR_CODES.TRANSACTION_PREPARATION_ERROR,
          "Error creating EOI",
          { cause: error as Error },
        );
        logger.error(clientError, {
          data: metadata,
        });
        handleError({
          error,
          metadata,
        });
        reset();
      }
    },
    [
      setProcessing,
      createDelegationEoi,
      goToStep,
      signBbnTx,
      sendBbnTx,
      addDelegation,
      setVerifiedDelegation,
      handleError,
      reset,
      refetchDelegations,
      validators,
      publicKeyNoCoord,
      btcAddress,
      bech32Address,
      logger,
    ],
  );

  const stakeDelegation = useCallback(
    async (delegation: DelegationV2) => {
      try {
        setProcessing(true);

        const {
          finalityProviderBtcPksHex,
          stakingAmount,
          stakingTimelock,
          paramsVersion,
          stakingTxHashHex,
          stakingTxHex,
        } = delegation;

        await submitStakingTx(
          {
            finalityProviderPksNoCoordHex: finalityProviderBtcPksHex,
            stakingAmountSat: stakingAmount,
            stakingTimelock,
          },
          paramsVersion,
          stakingTxHashHex,
          stakingTxHex,
        );
        updateDelegationStatus(
          stakingTxHashHex,
          DelegationState.INTERMEDIATE_PENDING_BTC_CONFIRMATION,
        );
        reset();
        goToStep(StakingStep.FEEDBACK_SUCCESS);
      } catch (error: any) {
        const clientError = new ClientError(
          ERROR_CODES.TRANSACTION_SUBMISSION_ERROR,
          "Error submitting staking transaction",
          { cause: error as Error },
        );
        logger.error(clientError);
        reset();
        handleError({
          error,
          displayOptions: {
            retryAction: () => stakeDelegation(delegation),
          },
          metadata: {
            stakingTxHash: delegation.stakingTxHashHex,
            userPublicKey: publicKeyNoCoord,
            btcAddress: btcAddress,
            babylonAddress: bech32Address,
          },
        });
      }
    },
    [
      updateDelegationStatus,
      submitStakingTx,
      goToStep,
      setProcessing,
      reset,
      handleError,
      publicKeyNoCoord,
      btcAddress,
      bech32Address,
      logger,
    ],
  );

  return { calculateFeeAmount, displayPreview, createEOI, stakeDelegation };
}
