import React from "react";
import { OREDER_CONTRACT_ADDRESS } from "../../../common/constants";
import tbabyLogo from "../../../common/assets/baby.png";

export const WithdrawCard = () => {
    return(
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
                </div>
            </div>
            <button
                className="mt-5 w-full bg-[#f0f0f0] p-4 text-center hover:opacity-75"
                // onClick={handleRedeem}
            >
                Withdraw tBaby
            </button>
        </div>
    )
}
