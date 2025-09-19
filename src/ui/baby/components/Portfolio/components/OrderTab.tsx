import { useUserOrderList } from "@/ui/baby/hooks/services/useUserOrderList";

import { OrderItem } from "./OrderItem";

export const OrderTab = () => {
  const { data } = useUserOrderList({ page: 1, limit: 10 });
  return (
    <div>
      <a
        href="/order"
        target="_blank"
        rel="noopener noreferrer"
        className="mx-1 text-xl text-blue-500 no-underline"
      >
        Order
      </a>
      <div className="flex w-full flex-col">
        <div className="flex items-center rounded-xl border-[1px] border-[#1b5f79] py-4 pl-8">
          <div className="w-[18%] px-2 text-left">Order</div>
          <div className="w-[7%] px-2 text-left">APR</div>
          <div className="w-[15%] px-2 text-left">BTC Amount</div>
          <div className="w-[15%] px-2 text-left">Total BABY staked</div>
          <div className="w-[15%] px-2 text-left">My BABY staked</div>
          <div className="w-[20%] px-2 text-left">Withdrawl Amount</div>
          <div className="w-[10%] px-2 text-center">Action</div>
        </div>
        {data?.data.map((order) => (
          <OrderItem key={order.order} order={order} />
        ))}
      </div>
    </div>
  );
};
