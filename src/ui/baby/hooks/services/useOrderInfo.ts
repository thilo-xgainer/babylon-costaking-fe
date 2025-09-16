import { useCosmwasmQuery } from "@/ui/common/hooks/client/useCosmwasmQuery";

export function useOrderInfo(orderAddress: string) {
  return useCosmwasmQuery({
    contractAddress: orderAddress,
    queryMsg: {
      get_total_token_deposit: {},
    },
  });
}
