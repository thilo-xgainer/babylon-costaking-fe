import { maxDecimals } from "@/ui/common/utils/maxDecimals";
import { useActivityDelegations } from "@/ui/common/hooks/services/useActivityDelegations";

import { useUserOrderList } from "./useUserOrderList";

export const useUserAssets = () => {
  const { data } = useUserOrderList({ page: 1, limit: 50 });
  const { delegations } = useActivityDelegations();

  // TODO: caculate exactly btc amount with exact btc address, baby amount with exchange rate
  return {
    btc: delegations
      .filter((el) => el.state === "ACTIVE")
      .reduce((acc, delegation) => {
        acc += maxDecimals(Number(delegation.stakingAmount) / 1e8, 8);
        return acc;
      }, 0),
    baby:
      data?.data?.reduce(
        (acc, order) =>
          acc +
          maxDecimals(Number(order.balance + order.pendingUnstaked) / 1e6, 6),
        0,
      ) ?? 0,
  };
};
