import { getUserHistory, OrderHistory } from "@/ui/common/api/getHistory";
import { ONE_MINUTE } from "@/ui/common/constants";
import { useClientQuery } from "@/ui/common/hooks/client/useClient";

export const USER_HISTORY_KEY = "USER_HISTORY";

export function useUserHistory({
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
    queryKey: [USER_HISTORY_KEY, page, typeFilter, orderAddress, userAddress],
    queryFn: () =>
      getUserHistory(userAddress, page, 10, typeFilter, orderAddress),
    enabled,
    refetchInterval: ONE_MINUTE * 5,
    placeholderData: (previousData) => previousData,
  });
}
