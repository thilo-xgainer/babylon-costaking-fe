import { OrderItem } from "./OrderItem";

export type Order = {
  address: string;
  apr: number;
  btcAmount: number;
  stakedAmount: number;
  userStaked: number;
  withdrawalAmount: number;
};

const orders: Order[] = [
  {
    address: "bbn1ms8r95qxdc2rvr609nmulsm46dshhxrmnn45ghgzf7mqrcfkkehssxv74t",
    apr: 7,
    btcAmount: 1,
    stakedAmount: 100,
    userStaked: 50,
    withdrawalAmount: 0,
  },
  {
    address: "bbn1g0kyleratfhm53qd68xct49sltdx8vjsz76amhx5dc0dt59t4s6szr3fwc",
    apr: 10,
    btcAmount: 2,
    stakedAmount: 1000,
    userStaked: 400,
    withdrawalAmount: 200,
  },
];

export const OrderTab = () => {
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
        {orders.map((order) => (
          <OrderItem key={order.address} order={order} />
        ))}
      </div>
    </div>
  );
};
