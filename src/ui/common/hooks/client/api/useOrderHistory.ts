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
  const queryKeys = [HISTORY_KEY, page, typeFilter];
  if (orderAddress) {
    queryKeys.push(orderAddress);
  }
  if (userAddress !== "") {
    queryKeys.push(userAddress);
  }
  return useClientQuery<OrderHistory>({
    queryKey: queryKeys,
    queryFn: () =>
      getOrderHistory(orderAddress ?? "", userAddress, page, 10, typeFilter),
    enabled,
    refetchInterval: ONE_MINUTE * 5,
    placeholderData: (previousData) => previousData,
  });
}
