import { useMemo } from "react";

import { useBTCWallet } from "@/ui/common/context/wallet/BTCWalletProvider";
import {
  useDelegationService,
  ConfirmationModalState,
} from "@/ui/common/hooks/services/useDelegationService";
import { useExpansionVisibilityService } from "@/ui/common/hooks/services/useExpansionVisibilityService";
import { useStakingManagerService } from "@/ui/common/hooks/services/useStakingManagerService";
import { useFinalityProviderState } from "@/ui/common/state/FinalityProviderState";
import { DelegationV2 } from "@/ui/common/types/delegationsV2";

import {
  ActivityCardData,
  useActivityCardTransformation,
} from "./useActivityCardTransformation";
import { useActivityValidation } from "./useActivityValidation";

/**
 * Main hook orchestrating all activity-related delegation logic.
 * Combines validation, visibility filtering, and card transformation.
 */
export function useActivityDelegations(): {
  activityData: ActivityCardData[];

  isLoading: boolean;
  isStakingManagerReady: boolean;

  processing: boolean;
  confirmationModal: ConfirmationModalState | null;
  executeDelegationAction: (
    action: string,
    delegation: DelegationV2,
  ) => Promise<void>;
  closeConfirmationModal: () => void;

  delegations: DelegationV2[];
} {
  // Core delegation and wallet data
  const {
    processing,
    confirmationModal,
    delegations,
    isLoading: isDelegationLoading,
    validations,
    executeDelegationAction,
    openConfirmationModal,
    closeConfirmationModal,
  } = useDelegationService();

  const { isLoading: isStakingManagerLoading } = useStakingManagerService();
  const isStakingManagerReady = !isStakingManagerLoading;

  const { finalityProviderMap } = useFinalityProviderState();
  const { publicKeyNoCoord } = useBTCWallet();

  // Expansion visibility service for filtering logic
  const { getActivityTabDelegations } =
    useExpansionVisibilityService(publicKeyNoCoord);

  // Step 1: Apply validation logic (including special VERIFIED expansion handling)
  const validatedDelegations = useActivityValidation(
    delegations,
    validations,
    publicKeyNoCoord,
  );

  // Step 2: Apply expansion visibility filtering
  const visibleDelegations = getActivityTabDelegations(validatedDelegations);

  // Step 3: Transform to activity card data
  const activityData: ActivityCardData[] = useActivityCardTransformation(
    visibleDelegations,
    finalityProviderMap,
    openConfirmationModal,
    isStakingManagerReady,
  );

  return useMemo(
    () => ({
      // Transformed data ready for rendering
      activityData,

      // Loading states
      isLoading: isDelegationLoading,
      isStakingManagerReady,

      // Modal states and actions
      processing,
      confirmationModal,
      executeDelegationAction,
      closeConfirmationModal,

      // Raw delegations for modals that need them
      delegations,
    }),
    [
      activityData,
      isDelegationLoading,
      isStakingManagerReady,
      processing,
      confirmationModal,
      executeDelegationAction,
      closeConfirmationModal,
      delegations,
    ],
  );
}
