import { Button } from "@babylonlabs-io/core-ui";
import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import { toUtf8 } from "@cosmjs/encoding";
import { toast } from "react-toastify";

import { useValidatorState } from "@/ui/baby/state/ValidatorState";
import { MARKETPLACE_CONTRACT_ADDRESS } from "@/ui/common/constants";
import { useCosmosWallet } from "@/ui/common/context/wallet/CosmosWalletProvider";
import { useBbnTransaction } from "@/ui/common/hooks/client/rpc/mutation/useBbnTransaction";
import { useCosmwasmQuery } from "@/ui/common/hooks/client/useCosmwasmQuery";

export const OrderInfo = () => {
  const { bech32Address } = useCosmosWallet();
  const { validators } = useValidatorState();
  const { sendBbnTx, signBbnTx } = useBbnTransaction();
  const { data: order, refetch: refetchOrder } = useCosmwasmQuery<string>({
    contractAddress: MARKETPLACE_CONTRACT_ADDRESS,
    queryMsg: {
      get_order_from_owner: {
        owner: bech32Address,
      },
    },
  });

  const handlerCreateOrder = async () => {
    const createOrderMsg: MsgExecuteContractEncodeObject = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: {
        sender: bech32Address,
        contract: MARKETPLACE_CONTRACT_ADDRESS,
        msg: toUtf8(
          JSON.stringify({
            create_order: {
              validator: validators[0].id,
            },
          }),
        ),
        funds: [],
      },
    };

    await sendBbnTx(await signBbnTx(createOrderMsg));

    toast.success("Create order complete");

    await refetchOrder();
  };

  return (
    <div className="bg-[#f9f9f9] p-4 dark:bg-[#252525]">
      <p>Your Order</p>
      {order ? (
        <a
          href={`/order/${order}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-1 no-underline"
        >
          {order}
        </a>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <p>You haven't created order yeet</p>
          <Button onClick={handlerCreateOrder}>Create order</Button>
        </div>
      )}
    </div>
  );
};
