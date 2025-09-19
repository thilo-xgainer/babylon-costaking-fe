import { getOrderHistory, OrderHistory } from "@/ui/common/api/getHistory";
import { ONE_MINUTE } from "@/ui/common/constants";
import { useClientQuery } from "@/ui/common/hooks/client/useClient";

export const HISTORY_KEY = "HISTORY";

export function useOrderHistory({
  enabled = true,
  orderAddress,
  userAddress,
  page,
}: {
  enabled?: boolean;
  orderAddress: string;
  userAddress: string;
  page: number;
}) {
  const queryKeys = [HISTORY_KEY, page];
  if (orderAddress) {
    queryKeys.push(orderAddress);
  }
  if (userAddress !== "") {
    queryKeys.push(userAddress);
  }
  return useClientQuery<OrderHistory>({
    queryKey: queryKeys,
    queryFn: () => getOrderHistory(orderAddress ?? "", userAddress, page, 10),
    enabled,
    refetchInterval: ONE_MINUTE * 5,
    placeholderData: (previousData) => previousData,
  });
}
