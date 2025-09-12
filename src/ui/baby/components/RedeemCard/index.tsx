import React, { useState } from "react";
import { OREDER_CONTRACT_ADDRESS } from "../../../common/constants";
import tbabyLogo from "../../../common/assets/baby.png";
import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import { toUtf8 } from "@cosmjs/encoding";
import { useBbnTransaction } from "../../../common/hooks/client/rpc/mutation/useBbnTransaction";
import { useCosmosWallet } from "@/ui/common/context/wallet/CosmosWalletProvider";
import { babyToUbbn } from "../../../common/utils/bbn";

export const Redeem = () => {
  const [amount, setAmount] = useState<string>();
  const { sendBbnTx, signBbnTx } = useBbnTransaction();
  const { bech32Address } = useCosmosWallet();

    const handleRedeem = async () => {
        const createOrderMsg: MsgExecuteContractEncodeObject = {
            typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
            value: {
              sender: bech32Address,
              contract: OREDER_CONTRACT_ADDRESS,
              msg: toUtf8(
                JSON.stringify({
                    un_stake: {
                    amount: babyToUbbn(Number(amount)),
                  },
                }),
              ),
              funds: [],
            },
          };
  
          const res = await sendBbnTx(await signBbnTx(createOrderMsg));
    }

  return (
    <div>
      <div className="bg-[#F9F9F9] p-4">
        <div className="mb-4">
          <p>Order: {OREDER_CONTRACT_ADDRESS}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={tbabyLogo} />
            <p className="text-lg">tBABY</p>
          </div>
          <input
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            className="w-2/3 bg-[#F9F9F9] text-right text-lg outline-none"
            placeholder="Enter Amount"
          />
        </div>
      </div>
      <button className="mt-5 w-full bg-[#f0f0f0] p-4 text-center">
        Redeem tBABY
      </button>
    </div>
  );
};
