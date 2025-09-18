import babyLogo from "@/ui/common/assets/baby-token.svg";
import btcLogo from "@/ui/common/assets/bitcoin.png";
import { formatAddress } from "@/utils/format";
export const BtcStaking = () => {
  return (
    <div>
      <a
        href="/btc"
        target="_blank"
        rel="noopener noreferrer"
        className="mx-1 text-xl text-blue-500 no-underline"
      >
        Bitcoin
      </a>
      <div className="bg-[#f9f9f9] px-4 py-3">
        <div className="flex items-center gap-1">
          <p>Order: </p>
          <a
            href={`/order/bbn1ms8r95qxdc2rvr609nmulsm46dshhxrmnn45ghgzf7mqrcfkkehssxv74t`}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-1 no-underline"
          >
            {formatAddress(
              "bbn1ms8r95qxdc2rvr609nmulsm46dshhxrmnn45ghgzf7mqrcfkkehssxv74t",
            )}
          </a>
        </div>
        <div className="flex items-center">
          <div className="w-1/2 bg-[#f9f9f9] p-4 dark:bg-[#252525]">
            <p className="text-center text-sm font-bold dark:text-white">
              Total BTC staked
            </p>
            <div className="mt-2 flex items-center justify-center gap-1">
              <span className="text-2xl font-bold">{10}</span>
              <img src={btcLogo} className="h-6 w-6" alt="btc" />
            </div>
          </div>
          <div className="w-1/2 bg-[#f9f9f9] p-4 dark:bg-[#252525]">
            <p className="text-center text-sm font-bold dark:text-white">
              BTC Staking Reward
            </p>
            <div className="mt-2 flex items-center justify-center gap-1">
              <span className="text-2xl font-bold">{10}</span>
              <img src={babyLogo} className="h-6 w-6" alt="baby" />
            </div>
          </div>
        </div>
        {/* <div className="flex items-center">
          <div>
            <p className="text-center text-sm font-bold dark:text-white">Stake BTC</p>
          </div>
        </div> */}
      </div>
    </div>
  );
};
