import { Link } from "react-router";

import { useOrderList } from "@/ui/baby/hooks/services/useOrderList";
import { BABYLON_EXPLORER } from "@/ui/common/constants";

export function OrderList() {
  const { data } = useOrderList();
  return (
    <div>
      <div className="mb-4 text-lg font-bold text-accent-primary">
        Order List
      </div>
      <table className="w-full">
        <thead className="bg-surface">
          <tr className="text-xs text-accent-secondary">
            <th className="h-[52px] px-2 text-left font-normal">
              Order Address
            </th>
            <th className="h-[52px] max-w-[12rem] truncate px-2 text-left font-normal">
              Owner
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((order) => (
            <tr
              key={order.address}
              className="bg-surface text-sm text-accent-primary odd:bg-secondary-highlight"
            >
              <td className={"h-16 px-2"}>
                <Link to={`/order/${order.address}`}>
                  {order.address.slice(0, 6)}...{order.address.slice(-4)}
                </Link>
              </td>
              <td className={"h-16 px-2"}>
                <a
                  href={`${BABYLON_EXPLORER}/address/${order.owner}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {order.owner.slice(0, 6)}...{order.owner.slice(-4)}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
