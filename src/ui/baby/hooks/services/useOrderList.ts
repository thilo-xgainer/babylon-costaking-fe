// import { toBech32 } from "@cosmjs/encoding";

import { MARKETPLACE_CONTRACT_ADDRESS } from "@/ui/common/constants";
import { useCosmwasmQuery } from "@/ui/common/hooks/client/useCosmwasmQuery";

export function useOrderList(options?: { enabled?: boolean }) {
  const result = useCosmwasmQuery<
    { id: number; order: string; owner: string }[]
  >({
    contractAddress: MARKETPLACE_CONTRACT_ADDRESS,
    queryMsg: {
      list_order: {
        start_after: 0,
        limit: 50,
      },
    },
    options,
  });

  return {
    ...result,
    data:
      result?.data?.map((el) => ({
        address: el.order,
        owner: el.owner,
      })) ?? [],
  };
}
// address: toBech32("bbn", Buffer.from(el.order, "hex")),
