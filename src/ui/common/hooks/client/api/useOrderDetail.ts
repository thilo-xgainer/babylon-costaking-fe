import { getOrderDetail, OrderDetail } from "@/ui/common/api/getOrderDetail";
import { ONE_MINUTE } from "@/ui/common/constants";
import { useClientQuery } from "@/ui/common/hooks/client/useClient";

export const ORDER_DETAIL_KEY = "ORDER_DETAIL";

export function useOrderDetail({
  enabled = true,
  orderAddress,
}: {
  enabled?: boolean;
  orderAddress: string;
}) {
  return useClientQuery<OrderDetail[]>({
    queryKey: [ORDER_DETAIL_KEY, orderAddress],
    queryFn: () => getOrderDetail(orderAddress),
    enabled,
    refetchInterval: ONE_MINUTE * 5,
  });
}
