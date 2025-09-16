import { Outlet } from "react-router";

import { DelegationState } from "@/ui/baby/state/DelegationState";
import { RewardState } from "@/ui/baby/state/RewardState";
import { StakingState } from "@/ui/baby/state/StakingState";
import { Content } from "@/ui/common/components/Content/Content";
import { useCosmosWallet } from "@/ui/common/context/wallet/CosmosWalletProvider";

import { useEpochPolling } from "./hooks/api/useEpochPolling";
import { PendingOperationsProvider } from "./hooks/services/usePendingOperationsService";
import { RedeemState } from "./state/RedeemState";
import { WithdrawState } from "./state/WithdrawState";

export default function BabyLayout() {
  return (
    <PendingOperationsProvider>
      <BabyLayoutContent />
    </PendingOperationsProvider>
  );
}

function BabyLayoutContent() {
  const { bech32Address } = useCosmosWallet();

  // Enable epoch polling to refetch delegations when epoch changes
  useEpochPolling(bech32Address);

  return (
    <StakingState>
      <RedeemState>
        <WithdrawState>
          <DelegationState>
            <RewardState>
              <Content>
                <Outlet />
              </Content>
            </RewardState>
          </DelegationState>
        </WithdrawState>
      </RedeemState>
    </StakingState>
  );
}
