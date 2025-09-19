import { getOrderHistory, OrderHistory } from "@/ui/common/api/getHistory";
import { ONE_MINUTE } from "@/ui/common/constants";
import { useClientQuery } from "@/ui/common/hooks/client/useClient";

export const HISTORY_KEY = "ORDER_HISTORY";

export function useOrderHistory({
  enabled = true,
  orderAddress,
  userAddress,
  page,
  typeFilter,
}: {
  enabled?: boolean;
  orderAddress: string;
  userAddress: string;
  page: number;
  typeFilter: string;
}) {
  return useClientQuery<OrderHistory>({
    queryKey: [HISTORY_KEY, page, typeFilter, orderAddress, userAddress],
    queryFn: () =>
      getOrderHistory(orderAddress, userAddress, page, 10, typeFilter),
    enabled: enabled && !!orderAddress && !!userAddress,
    refetchInterval: ONE_MINUTE * 5,
    placeholderData: (previousData) => previousData,
  });
}
