import { HistoryItemType } from "@/ui/common/api/getHistory";
// import { ubbnToBaby } from "@/ui/common/utils/bbn";
import { formatAddress, formatTimeHistory, getTimeAgo } from "@/utils/format";
import babyLogo from "@/ui/common/assets/baby.png";
import { ExpandIcon } from "@/ui/icons/ExpandIcon";

interface Props {
  history: HistoryItemType;
}

export const HistoryItem: React.FC<Props> = ({ history }) => {
  return (
    <div className="flex items-center px-8 py-4 text-sm">
      <div className="flex w-[25%] flex-col items-start px-2 text-left text-sm">
        <p>{formatTimeHistory(history.createdAt)}</p>
        <p className="text-grey-200 italic">{getTimeAgo(history.createdAt)}</p>
      </div>
      <div className="w-[15%] px-2 text-left">{history.type}</div>
      <div className="flex w-[25%] items-center gap-1 px-2 text-left">
        <a
          href={`https://testnet.babylon.explorers.guru/account/${history.user}`}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer text-blue-500 no-underline hover:text-blue-700"
        >
          {" "}
          {formatAddress(history.user)}
        </a>
        <ExpandIcon stroke="#7A8AA0" className="h-4 w-4" />
      </div>
      <div className="flex w-[15%] items-center gap-1 px-2 text-left">
        10 <img src={babyLogo} className="h-5 w-5" alt="baby" />
      </div>
      <div className="flex w-[25%] items-center gap-1 px-2 text-left">
        <a
          href={`https://testnet.babylon.explorers.guru/transaction/${history.hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer text-blue-500 no-underline hover:text-blue-700"
        >
          {" "}
          {formatAddress(history.hash)}
        </a>
        <ExpandIcon stroke="#7A8AA0" className="h-4 w-4" />
      </div>
    </div>
  );
};
