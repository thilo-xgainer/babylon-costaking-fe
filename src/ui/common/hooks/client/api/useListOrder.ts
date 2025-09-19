import { getListOrder, Order } from "@/ui/common/api/getListOrder";
import { ONE_MINUTE } from "@/ui/common/constants";
import { useClientQuery } from "@/ui/common/hooks/client/useClient";

export const LIST_ORDER_KEY = "LIST_ORDER";

export function useListOrder({ enabled = true }: { enabled?: boolean } = {}) {
  return useClientQuery<Order[]>({
    queryKey: [LIST_ORDER_KEY],
    queryFn: getListOrder,
    enabled,
    refetchInterval: ONE_MINUTE * 5,
  });
}
