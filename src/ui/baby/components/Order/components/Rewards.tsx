
import babyLogo from "@/ui/common/assets/baby-token.svg";

interface RewardItemProps {
    title: string
    rewardAmount: number
    className?: string
}

const RewardItem: React.FC<RewardItemProps> = ({title, rewardAmount, className = ""}) => {
    return (
        <div className={`p-4 bg-[#f9f9f9] dark:bg-[#252525] ${className}`}>
            <p className="dark:text-white font-bold text-sm text-center">{title}</p>
            <div className="flex items-center justify-center gap-1 mt-2">
                <span className="text-2xl font-bold">{rewardAmount}</span>
                <img src={babyLogo} className="w-6 h-6"  alt="baby"/>
            </div>
        </div>
    )
}

export const Rewards = () => {
    return (
        <div>
            <p>Rewards</p>
            <div className="flex items-center gap-5">
                <RewardItem className="w-1/2" title="Total BTC Staking Reward" rewardAmount={30}/>
                <RewardItem className="w-1/2" title="Total BABY Staking Reward" rewardAmount={30}/>
                {/* <RewardItem title="My BTC Staking Reward" rewardAmount={30}/>
                <RewardItem title="My BABY Staking Reward" rewardAmount={30}/> */}
            </div>
        </div>
    )
}