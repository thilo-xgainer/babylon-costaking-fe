import babyLogo from "@/ui/common/assets/baby-token.svg";
import btcLogo from "@/ui/common/assets/bitcoin.png";
import { MARKETPLACE_CONTRACT_ADDRESS } from "@/ui/common/constants";
import { useCosmosWallet } from "@/ui/common/context/wallet/CosmosWalletProvider";
import { useCosmwasmQuery } from "@/ui/common/hooks/client/useCosmwasmQuery";
import { formatAddress } from "@/utils/format";
import { Delegations } from "@/ui/common/components/Delegations/Delegations";
import { ActivityList } from "@/ui/common/components/Activity/components/ActivityList";

export const BtcStaking = () => {
  const { bech32Address } = useCosmosWallet();

  const { data: order } = useCosmwasmQuery<string>({
    contractAddress: MARKETPLACE_CONTRACT_ADDRESS,
    queryMsg: {
      get_order_from_owner: {
        owner: bech32Address,
      },
    },
  });
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
        <a
          href="/btc"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer bg-[#d6d6d6] px-4 py-2 hover:opacity-80"
        >
          Deposit
        </a>
        <div className="mx-auto w-3/4">
          <Delegations />
          <ActivityList />
        </div>
      </div>
    </div>
  );
};
