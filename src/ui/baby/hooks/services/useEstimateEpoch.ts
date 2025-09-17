import { useClientQuery } from "@/ui/common/hooks/client/useClient";

const getCurrentBlock = async () => {
  const response = await fetch(
    "https://testnet.babylon.api.explorers.guru/api/v1/blocks/latest",
  );
  const data: {
    height: number;
    hash: string;
    txCount: number;
  } = await response.json();
  return data.height;
};

const getCurrentEpoch = async () => {
  const response = await fetch(
    "https://babylon-testnet-api.nodes.guru/babylon/epoching/v1/current_epoch",
  );
  const data: {
    current_epoch: string;
    epoch_boundary: string;
  } = await response.json();
  return Number(data.epoch_boundary);
};

const estimateNextEpoch = async () => {
  const [blockHeight, lastCurEpochBlock] = await Promise.all([
    getCurrentBlock(),
    getCurrentEpoch(),
  ]);
  return (
    new Date().getTime() / 1000 + (lastCurEpochBlock - blockHeight + 1) * 10
  );
};

export function useEstimateEpoch() {
  return useClientQuery({
    queryKey: ["estimate_epoch"],
    queryFn: async () => {
      const nextEpochTimeStamp = await estimateNextEpoch();
      return nextEpochTimeStamp;
    },
  });
}
