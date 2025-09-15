import { createLCDClient, txs, utils } from "@babylonlabs-io/babylon-proto-ts";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

import { getNetworkConfigBBN } from "@/ui/common/config/network/bbn";

let clientInstance: Awaited<ReturnType<typeof createLCDClient>> | null = null;
let contractClientInstance: CosmWasmClient | null = null;

export const getBabylonClient = async () => {
  if (!clientInstance) {
    const networkConfig = getNetworkConfigBBN();
    clientInstance = await createLCDClient({ url: networkConfig.lcdUrl });
  }
  return clientInstance;
};

export const getCosmWasmClient = async () => {
  if (!contractClientInstance) {
    const networkConfig = getNetworkConfigBBN();
    contractClientInstance = await CosmWasmClient.connect(networkConfig.rpc);
  }
  return contractClientInstance;
};

export default {
  client: getBabylonClient,
  cosmWasmClient: getCosmWasmClient,
  txs,
  utils,
};
