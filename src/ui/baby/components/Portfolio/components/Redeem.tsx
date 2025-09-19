import React, { Dispatch, SetStateAction, useRef } from "react";
import { RedeemCard } from "../../RedeemCard";
import useOutsideClick from "@/hooks/useClickOutside";
import { useRedeemState } from "@/ui/baby/state/RedeemState";

interface Props {
  setIsModalOpend: Dispatch<SetStateAction<boolean>>;
}

export const Redeem: React.FC<Props> = ({ setIsModalOpend }) => {
  const { step } = useRedeemState();
  const cardRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick([cardRef], () => {
    if (step.name === "initial") {
      setIsModalOpend(false);
    }
  });
  return (
    <>
      <div className="fixed left-0 top-0 z-20 flex h-screen w-screen items-center justify-center bg-[#eeeeeea6]">
        <div className="w-1/2 bg-[#f9f9f9] px-4 py-3" ref={cardRef}>
          <p>Redeem</p>
          <RedeemCard />
        </div>
      </div>
    </>
  );
};
