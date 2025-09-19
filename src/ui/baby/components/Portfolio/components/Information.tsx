import { Avatar, CopyIcon } from "@babylonlabs-io/core-ui";
import { useWidgetState } from "@babylonlabs-io/wallet-connector";

import { useBTCWallet } from "@/ui/common/context/wallet/BTCWalletProvider";
import { useCosmosWallet } from "@/ui/common/context/wallet/CosmosWalletProvider";
import { formatAddress } from "@/utils/format";
import { useUserAssets } from "@/ui/baby/hooks/services/useUserAssets";
import { usePrices } from "@/ui/common/hooks/client/api/usePrices";
import { formatCurrency } from "@/ui/common/utils/formatCurrency";

export const Information = () => {
  const { selectedWallets } = useWidgetState();
  const { btc, baby } = useUserAssets();
  const { data: prices } = usePrices();

  const { address: btcAddress } = useBTCWallet();
  const { bech32Address } = useCosmosWallet();

  const handleCoppy = (type: "btc" | "baby") => {
    navigator.clipboard.writeText(type === "btc" ? btcAddress : bech32Address);
  };
  return (
    <div className="flex items-center bg-[#f9f9f9] p-8 dark:bg-[#252525]">
      <div className="flex w-1/2 flex-col gap-3 border-r-[1px] border-[#e4e3e3] pr-5">
        {selectedWallets["BTC"] ? (
          <div className="flex items-center gap-5">
            <div className="h-[56px] rounded-full bg-[#f1f1f1] p-2">
              <Avatar
                alt={selectedWallets["BTC"]?.name}
                url={selectedWallets["BTC"]?.icon}
                size="large"
                className="box-content bg-accent-contrast object-contain"
              />
            </div>
            <div className="flex items-center gap-1">
              <a
                className="text-xl text-blue-500"
                href={`https://mempool.space/signet/address/${btcAddress}`}
              >
                {formatAddress(btcAddress)}
              </a>
              <button
                className="cursor-pointer p-2 hover:bg-[#f1f1f1]"
                onClick={() => {
                  handleCoppy("btc");
                }}
              >
                <CopyIcon />
              </button>
            </div>
          </div>
        ) : null}
        <div className="flex items-center gap-5">
          <div className="h-[56px] rounded-full bg-[#f1f1f1] p-2">
            <Avatar
              alt={selectedWallets["BBN"]?.name}
              url={selectedWallets["BBN"]?.icon}
              size="large"
              className="box-content bg-accent-contrast object-contain"
            />
          </div>
          <div className="flex items-center gap-1">
            <a
              className="text-xl text-blue-500"
              href={`https://testnet.babylon.explorers.guru/account/${bech32Address}`}
            >
              {formatAddress(bech32Address)}
            </a>
            <button
              className="cursor-pointer p-2 hover:bg-[#f1f1f1]"
              onClick={() => {
                handleCoppy("btc");
              }}
            >
              <CopyIcon />
            </button>
          </div>
        </div>
      </div>
      <div className="flex w-1/2 flex-col items-center gap-1">
        <p className="text-2xl font-semibold dark:text-white">
          {formatCurrency(
            btc * (prices?.BTC ?? 0) + baby * (prices?.BABY ?? 0),
            {
              precision: 2,
            },
          )}
        </p>
        <p>Total Position Value</p>
      </div>
    </div>
  );
};
