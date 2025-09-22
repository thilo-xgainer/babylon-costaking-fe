import { Link } from "react-router";

// import { BABYLON_EXPLORER } from "@/ui/common/constants";
import btcLogo from "@/ui/common/assets/bitcoin.png";
import { useListOrder } from "@/ui/common/hooks/client/api/useListOrder";
import { Information } from "./components/Infomation";

export function OrderList() {
  const { data } = useListOrder();
  return (
    <div className="pb-5">
      <Information />
      <div></div>
      <table className="mx-auto w-full">
        <thead>
          <tr className="border-none dark:hover:bg-[#15202B]">
            <div
              className={`mx-auto flex w-full rounded-lg border border-blue-200 py-[17px] text-blue-900 dark:border-[#92C2F2] dark:text-[#92C2F2] md:pl-[30px]`}
            >
              <div className="my-auto ml-2 w-[25%] px-[2px] text-start font-medium max-md:text-xs sm:px-2 md:text-sm">
                Order
              </div>
              <div className="my-auto flex w-[25%] items-center justify-center gap-[2px] px-[2px] text-end font-medium max-md:text-xs max-sm:w-[25%] sm:gap-1 sm:px-2 md:text-sm">
                BTC Amount
                {/* <SortButton setSortOpt={setSortOpt} type={['btcAmount:asc', 'btcAmount:desc']} sortOpt={sortOpt} /> */}
              </div>
              <div className="my-auto w-[25%] px-[2px] text-center font-medium max-md:text-xs sm:px-2 md:text-sm">
                {" "}
                Reward Sharing
              </div>
              <div className="my-auto w-[25%] px-[2px] text-center font-medium max-md:text-xs sm:px-2 md:text-sm">
                {" "}
                Reward
              </div>
            </div>
          </tr>
        </thead>

        <tbody>
          {(data?.data ?? []).map((order) => (
            <tr key={order.address} className="pb-4 pt-5">
              <Link
                to={`/order/${order.address}`}
                className="mt-5 block cursor-pointer rounded-lg bg-white !pb-7 !pt-5 !no-underline hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 sm:!pb-4"
              >
                <div className="mx-auto mb-1 flex w-full px-2 pb-2 pl-2 text-blue-900 dark:text-white sm:pl-[30px]">
                  <div className="my-auto w-1/4 flex-1 px-1 text-start font-medium max-md:text-xs md:text-sm">
                    {order.address.slice(0, 6)}...{order.address.slice(-4)}
                  </div>
                  <div className="my-auto flex w-1/4 items-center justify-center gap-1 px-1 text-end font-medium max-md:text-xs sm:px-2 md:text-sm">
                    <p>{Number(order.btcAmount) / 1e8}</p>
                    <img src={btcLogo} className="h-5 w-5" />
                  </div>
                  <div className="w-1/4 text-center">50%</div>
                  <div className="w-1/4 text-center">
                    <div className="mx-auto flex w-max items-center rounded-full bg-[#24A36C] px-2 py-1 text-xs text-white dark:text-[#EEE7E7]">
                      6% APR
                    </div>
                  </div>
                </div>
              </Link>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
