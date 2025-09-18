import React, { useEffect, useRef, useState } from "react";
import babyLogo from "@/ui/common/assets/baby.png";
import { formatAddress } from "@/utils/format";
import { ThreeDotsMenuIcon } from "@babylonlabs-io/core-ui";
import { Order } from "./OrderTab";
import { Redeem } from "./Redeem";
import { useRedeemState } from "@/ui/baby/state/RedeemState";

interface Props {
  order: Order;
}

export const OrderItem: React.FC<Props> = ({ order }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { setManualOrderAddress } = useRedeemState();

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    handleMouseLeave();
  }, [isModalOpen]);

  return (
    <div className="flex items-center py-4 pl-8">
      <div className="w-[18%] px-2 text-left">
        <a
          href={`/order/${order.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-1 text-xl text-blue-500 no-underline hover:underline"
        >
          {formatAddress(order.address)}
        </a>
      </div>
      <div className="w-[7%] px-2 text-left">{order.apr}%</div>
      <div className="w-[15%] px-2 text-left">{order.btcAmount} BTC</div>
      <div className="flex w-[15%] items-center justify-start gap-1 px-2 text-left">
        {order.stakedAmount}{" "}
        <img src={babyLogo} className="h-5 w-5" alt="baby" />
      </div>
      <div className="flex w-[15%] items-center justify-start gap-1 px-2 text-left">
        {order.userStaked} <img src={babyLogo} className="h-5 w-5" alt="baby" />
      </div>
      <div className="flex w-[20%] items-center justify-start gap-1 px-2 text-left">
        {order.withdrawalAmount}{" "}
        <img src={babyLogo} className="h-5 w-5" alt="baby" />
      </div>
      <div className="flex w-[10%] items-center justify-end px-2">
        <div
          className="relative rounded-full p-2 duration-200 hover:bg-[#1b5f79]"
          ref={dropdownRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <ThreeDotsMenuIcon />
          {isOpen && (
            <div
              className="absolute right-0 top-9 z-[5] w-48 rounded-lg border-gray-200 shadow-lg"
              ref={dropdownRef}
            >
              <div
                className="cursor-pointer rounded-se-lg rounded-ss-lg bg-[#1b5f79] px-4 py-2 text-center hover:bg-[#237c9f]"
                onClick={() => {
                  setManualOrderAddress(order.address);
                  setIsModalOpen(true);
                }}
              >
                Redeem
              </div>
              <div
                className={`cursor-pointer rounded-ee-lg rounded-es-lg px-4 py-2 text-center ${order.withdrawalAmount === 0 ? "bg-[#b9cdd5]" : "bg-[#1b5f79] hover:bg-[#237c9f]"}`}
              >
                Withdraw
              </div>
            </div>
          )}
        </div>
      </div>
      {isModalOpen ? <Redeem setIsModalOpend={setIsModalOpen} /> : null}
    </div>
  );
};
