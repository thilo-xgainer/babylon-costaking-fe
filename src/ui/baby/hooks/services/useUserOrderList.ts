import axios from "axios";

import { useClientQuery } from "@/ui/common/hooks/client/useClient";
import { API_END_POINT } from "@/ui/common/constants";
import { useCosmosWallet } from "@/ui/common/context/wallet/CosmosWalletProvider";
import { Pagination } from "@/ui/common/types/pagination";

export type Order = {
  order: string;
  apr: number;
  btcAmount: number;
  balance: number;
  pendingUnstaked: number;
  withdrawable: number;
};

export function useUserOrderList({
  page = 1,
  limit = 50,
}: {
  page: number;
  limit: number;
}) {
  const { bech32Address } = useCosmosWallet();
  return useClientQuery({
    queryKey: ["user-order-list", bech32Address, page, limit],
    enabled: !!bech32Address,
    queryFn: async () => {
      const res = await axios.get<{
        data: Order[];
        pagination: Pagination;
      }>(
        `${API_END_POINT}/order/user/${bech32Address}?page=${page}&limit=${limit}`,
      );
      return res.data;
    },
  });
}
