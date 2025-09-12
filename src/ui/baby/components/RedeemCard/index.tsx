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
    try {
        console.log("bech32Address: ",bech32Address, amount);
        
      const redeemBabyMsg: MsgExecuteContractEncodeObject = {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: {
          sender: bech32Address,
          contract:
            "bbn16l8yy4y9yww56x4ds24fy0pdv5ewcc2crnw77elzfts272325hfqwpm4c3",
          msg: toUtf8(
            JSON.stringify({
              un_stake: {
                amount: babyToUbbn(Number(amount)).toString()
              },
            }),
          ),
          funds: []
        },
      }

      const res = await sendBbnTx(await signBbnTx(redeemBabyMsg));
      console.log("res: ", res);
    } catch (error) {
      console.log("error: ", error);
    }
  };

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
      <button
        className="mt-5 w-full bg-[#f0f0f0] p-4 text-center hover:opacity-75"
        onClick={handleRedeem}
      >
        Redeem tBABY
      </button>
    </div>
  );
};
