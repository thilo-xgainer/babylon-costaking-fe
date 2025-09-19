import axios from "axios";

import { useCosmosWallet } from "@/ui/common/context/wallet/CosmosWalletProvider";
import { useClientQuery } from "@/ui/common/hooks/client/useClient";
import { API_END_POINT } from "@/ui/common/constants";

export const useOwnOrder = () => {
  const { bech32Address } = useCosmosWallet();
  return useClientQuery({
    queryKey: ["own-order", bech32Address],
    enabled: !!bech32Address,
    queryFn: async () => {
      const res = await axios.get<{
        address: string;
        owner: string;
        delegations: [
          {
            active: boolean;
            total_sat: string;
          },
        ];
      }>(`${API_END_POINT}/order/owner/${bech32Address}`);
      return res.data;
    },
  });
};
