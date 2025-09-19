import { Link } from "react-router";

import { MARKETPLACE_CONTRACT_ADDRESS } from "@/ui/common/constants";
import { useCosmosWallet } from "@/ui/common/context/wallet/CosmosWalletProvider";
import { useCosmwasmQuery } from "@/ui/common/hooks/client/useCosmwasmQuery";
export const BtcStaking = () => {
  const { bech32Address } = useCosmosWallet();

  const { data: order } = useCosmwasmQuery<string>({
    contractAddress: MARKETPLACE_CONTRACT_ADDRESS,
    queryMsg: {
      get_order_from_owner: {
        owner: bech32Address,
      },
    },
  });

  return (
    <div>
      <Link
        to={`/order/${order}`}
        className="mx-1 text-xl text-blue-500 no-underline"
      >
        Your Order
      </Link>
    </div>
  );
};
