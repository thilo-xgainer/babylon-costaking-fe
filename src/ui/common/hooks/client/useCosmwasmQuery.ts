import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { getCosmWasmClient } from "@/infrastructure/babylon";

interface UseContractQueryProps<TData = any> {
  contractAddress: string;
  queryMsg: Record<string, any>;
  options?: Omit<UseQueryOptions<TData, Error>, "queryKey" | "queryFn">;
}

export const useCosmwasmQuery = <TData = any>({
  contractAddress,
  queryMsg,
  options = {},
}: UseContractQueryProps<TData>) => {
  return useQuery<TData, Error>({
    queryKey: ["contractQuery", contractAddress, queryMsg],
    queryFn: async () => {
      const client = await getCosmWasmClient();
      const result = await client.queryContractSmart(contractAddress, queryMsg);
      return result;
    },
    ...options,
  });
};
