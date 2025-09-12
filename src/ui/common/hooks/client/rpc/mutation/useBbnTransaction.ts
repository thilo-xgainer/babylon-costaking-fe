import type { EncodeObject } from "@cosmjs/proto-signing";
import { useCallback } from "react";

import { BBN_GAS_PRICE } from "@/ui/common/config";
import { useLogger } from "@/ui/common/hooks/useLogger";

import { useSigningStargateClient } from "./useSigningStargateClient";

const GAS_MULTIPLIER = 1.5;
const GAS_DENOM = "ubbn";

export interface BbnGasFee {
  amount: { denom: string; amount: string }[];
  gas: string;
}

/**
 * Transaction service for Babylon which contains all the transactions for
 * interacting with Babylon RPC nodes
 */
export const useBbnTransaction = () => {
  const { simulate, broadcastTx, signTx } = useSigningStargateClient();
  const logger = useLogger();

  /**
   * Estimates the gas fee for a transaction.
   * @param {Object} msg - The transaction message.
   * @returns {Promise<Object>} - The gas fee.
   */
  const estimateBbnGasFee = useCallback(
    async (msg: EncodeObject | EncodeObject[]): Promise<BbnGasFee> => {
      const gasEstimate = await simulate(msg);
      const gasWanted = Math.ceil(gasEstimate * GAS_MULTIPLIER);
      return {
        amount: [
          {
            denom: GAS_DENOM,
            amount: (gasWanted * BBN_GAS_PRICE).toFixed(0),
          },
        ],
        gas: gasWanted.toString(),
      };
    },
    [simulate],
  );

  /**
   * Sign a transaction
   * @param {Object} msg - The transaction message.
   * @returns The signed transaction in bytes
   */
  const signBbnTx = useCallback(
    async (msg: EncodeObject | EncodeObject[]): Promise<Uint8Array> => {
      logger.info("Starting BBN transaction signing", {
        txs: msg,
      });

      // console.log({
      //   fp_btc_pk_list: [
      //     Array.from(msg.value.fpBtcPkList[0])
      //       .map((el) => el.toString(16).padStart(2, "0"))
      //       .join(""),
      //   ],
      //   staker_addr:
      //     "bbn1szhhevmwddnzdssvd4kgj7ucfpkkkdqqrcnvw06x2x08fjupgccs0w3f9m",
      //   pop: {
      //     btc_sig_type: "BIP322",
      //     btc_sig: Array.from(msg.value.pop.btcSig)
      //       .map((el) => el.toString(16).padStart(2, "0"))
      //       .join(""),
      //   },
      //   btc_pk: Array.from(msg.value.btcPk)
      //     .map((el) => el.toString(16).padStart(2, "0"))
      //     .join(""),
      //   staking_time: 64000,
      //   staking_value: 57000,
      //   staking_tx: Array.from(msg.value.stakingTx)
      //     .map((el) => el.toString(16).padStart(2, "0"))
      //     .join(""),
      //   slashing_tx: Array.from(msg.value.slashingTx)
      //     .map((el) => el.toString(16).padStart(2, "0"))
      //     .join(""),
      //   delegator_slashing_sig: Array.from(msg.value.delegatorSlashingSig)
      //     .map((el) => el.toString(16).padStart(2, "0"))
      //     .join(""),
      //   unbonding_time: 301,
      //   unbonding_tx: Array.from(msg.value.unbondingTx)
      //     .map((el) => el.toString(16).padStart(2, "0"))
      //     .join(""),
      //   unbonding_value: 54000,
      //   unbonding_slashing_tx: Array.from(msg.value.unbondingSlashingTx)
      //     .map((el) => el.toString(16).padStart(2, "0"))
      //     .join(""),
      //   delegator_unbonding_slashing_sig: Array.from(
      //     msg.value.delegatorUnbondingSlashingSig,
      //   )
      //     .map((el) => el.toString(16).padStart(2, "0"))
      //     .join(""),
      // });

      const fee = await estimateBbnGasFee(msg);
      return signTx(msg, fee);
    },
    [logger, signTx, estimateBbnGasFee],
  );

  /**
   * Sends a transaction to the Babylon network.
   * @param {Uint8Array} tx - The transaction in bytes.
   * @returns {Promise<{txHash: string; gasUsed: string;}>} - The transaction hash and gas used.
   */
  const sendBbnTx = useCallback(
    async (tx: Uint8Array) => {
      logger.info("Broadcasting BBN transaction", {
        txSize: tx.length,
        category: "transaction",
      });

      return broadcastTx(tx);
    },
    [broadcastTx, logger],
  );

  return {
    signBbnTx,
    sendBbnTx,
    estimateBbnGasFee,
  };
};
