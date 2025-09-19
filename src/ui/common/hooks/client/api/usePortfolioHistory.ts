import { OrderHistory } from "@/ui/common/api/getHistory";
import { getPortfolioHistory } from "@/ui/common/api/getPorfolioHistory";
import { ONE_MINUTE } from "@/ui/common/constants";
import { useClientQuery } from "@/ui/common/hooks/client/useClient";

export const PORTFOLIO_HISTORY_KEY = "PORTFOLIO_HISTORY";

export function usePortfolioHistory({
  enabled = true,
  userAddress,
  page,
  typeFilter,
}: {
  enabled?: boolean;
  userAddress: string;
  page: number;
  typeFilter: string;
}) {
  const queryKeys = [PORTFOLIO_HISTORY_KEY, page, typeFilter, userAddress];
  return useClientQuery<OrderHistory>({
    queryKey: queryKeys,
    queryFn: () => getPortfolioHistory(userAddress, page, 10, typeFilter),
    enabled,
    refetchInterval: ONE_MINUTE * 5,
    placeholderData: (previousData) => previousData,
  });
}
