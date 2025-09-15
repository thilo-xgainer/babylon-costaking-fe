import { useCallback, useMemo, useState, type PropsWithChildren } from "react";

import { useCosmosWallet } from "@/ui/common/context/wallet/CosmosWalletProvider";
import { createStateUtils } from "@/ui/common/utils/createStateUtils";
import { useCosmwasmQuery } from "@/ui/common/hooks/client/useCosmwasmQuery";
import { useBbnQuery } from "@/ui/common/hooks/client/rpc/queries/useBbnQuery";
import { ORDER_ADDRESS } from "@/ui/common/constants";

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

  const { bech32Address: bbnAddress } = useCosmosWallet();

  const {
    data: rewardBalance = 0,
    isLoading: isRewardBalanceLoading,
    refetch: refetchRewardBalance,
  } = useCosmwasmQuery({
    contractAddress: ORDER_ADDRESS,
    queryMsg: {
      get_btc_reward: {},
    },
  });

  const {
    rewardsQuery: {
      data: pendingReward = 0,
      isLoading: isPendingRewardLoading,
      refetch: refetchPendingReward,
    },
  } = useBbnQuery();

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
      rewardBalance: rewardBalance + pendingReward,
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
    ],
  );

  return <StateProvider value={context}>{children}</StateProvider>;
}

export { useRewardsState };
