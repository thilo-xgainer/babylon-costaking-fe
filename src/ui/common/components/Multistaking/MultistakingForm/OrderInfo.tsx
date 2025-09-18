import { useOrderList } from "@/ui/baby/hooks/services/useOrderList";
import { useValidatorState } from "@/ui/baby/state/ValidatorState";
import { MARKETPLACE_CONTRACT_ADDRESS } from "@/ui/common/constants";
import { useCosmosWallet } from "@/ui/common/context/wallet/CosmosWalletProvider";
import { useBbnTransaction } from "@/ui/common/hooks/client/rpc/mutation/useBbnTransaction";
import { Button } from "@babylonlabs-io/core-ui";
import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import { toUtf8 } from "@cosmjs/encoding";
import { toast } from "react-toastify";

export const OrderInfo = () => {
  const { data: orderList, refetch: refetchOrderList } = useOrderList();
  const { bech32Address } = useCosmosWallet();
  const order = orderList.find((order) => order.owner === bech32Address);
  const { validators } = useValidatorState();
  const { sendBbnTx, signBbnTx } = useBbnTransaction();

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

    await refetchOrderList();
  };

  return (
    <div className="bg-[#f9f9f9] p-4">
      <p>Your Order</p>
      {order ? (
        <a
          href={`/order/${order.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-1 no-underline"
        >
          {order.address}
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
