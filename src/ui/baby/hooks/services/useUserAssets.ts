import { maxDecimals } from "@/ui/common/utils/maxDecimals";

import { useUserOrderList } from "./useUserOrderList";
import { useOwnOrder } from "./useOwnOrder";

export const useUserAssets = () => {
  const { data } = useUserOrderList({ page: 1, limit: 50 });
  const { data: order } = useOwnOrder();

  // TODO: caculate exactly btc amount with exact btc address, baby amount with exchange rate
  return {
    btc:
      order?.delegations?.reduce((acc, order) => {
        if (order.active) {
          acc += maxDecimals(Number(order.total_sat) / 1e8, 8);
        }
        return acc;
      }, 0) ?? 0,
    baby:
      data?.data?.reduce(
        (acc, order) =>
          acc +
          maxDecimals(Number(order.balance + order.pendingUnstaked) / 1e6, 6),
        0,
      ) ?? 0,
  };
};
