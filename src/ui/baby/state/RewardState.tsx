import { useCallback, useMemo, useState, type PropsWithChildren } from "react";
import { useParams } from "react-router";

import { useCosmosWallet } from "@/ui/common/context/wallet/CosmosWalletProvider";
import { createStateUtils } from "@/ui/common/utils/createStateUtils";
import { useCosmwasmQuery } from "@/ui/common/hooks/client/useCosmwasmQuery";
import { useBbnQuery } from "@/ui/common/hooks/client/rpc/queries/useBbnQuery";
import { MARKETPLACE_CONTRACT_ADDRESS } from "@/ui/common/constants";

interface RewardsStateProps {
  loading: boolean;
  showRewardModal: boolean;
  showProcessingModal: boolean;
  processing: boolean;
  bbnAddress: string;
  rewardBalance: number;
  transactionFee: number;
  transactionHash: string;
  setTransactionHash: (hash: string) => void;
  setTransactionFee: (value: number) => void;
  openRewardModal: () => void;
  closeRewardModal: () => void;
  openProcessingModal: () => void;
  closeProcessingModal: () => void;
  setProcessing: (value: boolean) => void;
  refetchRewardBalance: () => Promise<void>;
}

const defaultState: RewardsStateProps = {
  loading: false,
  showRewardModal: false,
  showProcessingModal: false,
  processing: false,
  bbnAddress: "",
  rewardBalance: 0,
  transactionFee: 0,
  transactionHash: "",
  setTransactionHash: () => {},
  openRewardModal: () => {},
  closeRewardModal: () => {},
  openProcessingModal: () => {},
  closeProcessingModal: () => {},
  setProcessing: () => {},
  setTransactionFee: () => {},
  refetchRewardBalance: () => Promise.resolve(),
};

const { StateProvider, useState: useRewardsState } =
  createStateUtils<RewardsStateProps>(defaultState);

export function RewardsState({ children }: PropsWithChildren) {
  const [showRewardModal, setRewardModal] = useState(false);
  const [showProcessingModal, setProcessingModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [transactionFee, setTransactionFee] = useState(0);
  const [transactionHash, setTransactionHash] = useState("");
  const { orderAddress } = useParams();
  const { bech32Address: bbnAddress } = useCosmosWallet();

  const {
    data: rewardBalance = 0,
    isLoading: isRewardBalanceLoading,
    refetch: refetchRewardBalance,
  } = useCosmwasmQuery({
    contractAddress: orderAddress!,
    queryMsg: {
      get_btc_reward: {},
    },
    options: { enabled: !!orderAddress },
  });

  const {
    rewardsQuery: {
      data: pendingReward = 0,
      isLoading: isPendingRewardLoading,
      refetch: refetchPendingReward,
    },
  } = useBbnQuery();

  const { data: feeConfig } = useCosmwasmQuery({
    contractAddress: MARKETPLACE_CONTRACT_ADDRESS,
    queryMsg: {
      get_fee_config: {},
    },
  });

  const fee = Number(feeConfig?.fee_btc_stake_rate ?? 0.05);

  const openRewardModal = useCallback(() => {
    setRewardModal(true);
  }, []);

  const closeRewardModal = useCallback(() => {
    setRewardModal(false);
  }, []);

  const openProcessingModal = useCallback(() => {
    setProcessingModal(true);
  }, []);

  const closeProcessingModal = useCallback(() => {
    setProcessingModal(false);
  }, []);

  const context = useMemo(
    () => ({
      loading: isRewardBalanceLoading || isPendingRewardLoading,
      showRewardModal,
      showProcessingModal,
      processing,
      bbnAddress,
      rewardBalance: rewardBalance + pendingReward * (1 - fee),
      transactionFee,
      transactionHash,
      setTransactionHash,
      setTransactionFee,
      setProcessing,
      openRewardModal,
      closeRewardModal,
      openProcessingModal,
      closeProcessingModal,
      refetchRewardBalance: async () => {
        await Promise.all([refetchRewardBalance(), refetchPendingReward()]);
      },
    }),
    [
      isRewardBalanceLoading,
      showRewardModal,
      showProcessingModal,
      openProcessingModal,
      closeProcessingModal,
      processing,
      bbnAddress,
      rewardBalance,
      transactionFee,
      transactionHash,
      openRewardModal,
      closeRewardModal,
      refetchRewardBalance,
      pendingReward,
      isPendingRewardLoading,
      refetchPendingReward,
      fee,
    ],
  );

  return <StateProvider value={context}>{children}</StateProvider>;
}

export { useRewardsState };
