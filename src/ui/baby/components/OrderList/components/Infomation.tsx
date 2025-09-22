import btcLogo from "@/ui/common/assets/bitcoin.png";
import { Link } from "react-router";
export const Information = () => {
  return (
    <div className="mb-6 flex w-full items-start justify-between">
      <div className="flex h-full flex-col text-center max-sm:px-8 max-sm:text-start md:text-left">
        <p
          className={`text-brand-text-title text-3xl font-semibold max-md:mb-5 max-sm:mb-2 md:text-[32px]`}
        >
          Merge Marketplace
        </p>
        <div className="max-sm:text-start">
          {" "}
          <p
            className={`my-2.5 text-base font-bold text-[#092949] dark:text-[#92C2F2]`}
          >
            Maximizing Core dual-staking yields, no matter your capital size.
          </p>
          {/* <p className={`text-sm text-[#3B4D60] dark:text-[#BFCCDB]`}>
            For CORE Holders: Choose orders fit you. Stake or Unstake anytime.
          </p> */}
          {/* <p
                      className={`flex max-sm:justify-start max-md:justify-center gap-1 text-sm text-[#3B4D60] dark:text-[#BFCCDB] ${dmsans.className}`}
                    >
                      <TextTooltip
                        text={
                          <div className="flex items-center cursor-default">
                            <InfoTooltip className={` dark:text-[#BFCCDB] text-[#3B4D60] mr-1 `} />{' '}
                            <p>Rewards are snapshotted every day at 00:00 UTC.</p>
                          </div>
                        }
                        id="tooltip-text"
                        className="text-[#8DA5BF] dark:text-[#D2DCE6] !ml-0"
                        // style={{ width: '160px' }}
                        content={
                          <>
                            {' '}
                            <p className="text-left text-xs">
                              Core rewards are captured in a daily snapshot at 00:00 UTC. <br /> <br />
                              The first reward distribution may take up to two snapshots, meaning the rewards could be
                              distributed within 48 hours. Subsequent distributions are processed within 24 hours.
                            </p>
                          </>
                        }
                      />
                    </p> */}
        </div>
        {/* <div className={`text-sm  text-[#8DA5BF] mt-6  max-sm:text-start ${dmsans.className}`}>
                    <Link
                      href={`https://docs.b14g.xyz/userguide/user-guide-merge-marketplace`}
                      target="_blank"
                      className=" text-[#8DA5BF] dark:text-[#D2DCE6] underline"
                    >
                      Learn How
                    </Link>
                  </div> */}
      </div>
      <div className="cursor-pointer rounded-[16px] border border-[#CC7400] bg-[#FFF4E5] p-6 hover:border-[#FF9000] hover:shadow-[inset_0_0_30px_5px_#FF900026,inset_0_2px_2px_-1px_#F7931A1A] dark:bg-[#331D00]">
        <div className="flex items-center">
          <img src={btcLogo} className="h-8 w-8" />
          <p className="ml-1 text-base font-bold text-[#125497] dark:text-[#2987E6]">
            Start as as BTC staker
          </p>
        </div>
        <p className="mb-4 mt-2 text-sm text-[#3F5770] dark:text-[#E2E8EF]">
          Create order and stake your BTC non-custodially.
        </p>
        <Link
          className="flex w-full items-center justify-center rounded-[12px] bg-[#1669BB] px-5 py-3 text-base text-white !no-underline hover:bg-[#4E95D9] hover:no-underline dark:hover:bg-[#12518F] max-sm:text-sm"
          to="/btc"
        >
          Stake BTC
        </Link>
      </div>
    </div>
  );
};
