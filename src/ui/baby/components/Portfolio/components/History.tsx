import { useEffect, useState } from "react";
import { useCosmosWallet } from "@/ui/common/context/wallet/CosmosWalletProvider";
import { PaginationType } from "@/types/type";
import { ShadcnPagination } from "../../ShadcnPagination";
import { HistoryItem } from "./HistoryItem";
import { usePortfolioHistory } from "@/ui/common/hooks/client/api/usePortfolioHistory";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/common/components/Select";
import { EmptyIcon } from "@/ui/icons/EmptyIcon";

const typesFilter: {
  label: string;
  value: string;
}[] = [
  {
    label: "Stake",
    value: "stake",
  },
  {
    label: "Unstake",
    value: "unstake",
  },
  {
    label: "Withdraw",
    value: "withdraw",
  },
  {
    label: "Claim",
    value: "claim",
  },
  {
    label: "All",
    value: "all",
  },
];

export const History = () => {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [pagination, setPagination] = useState<PaginationType>({
    currentPage: 1,
    totalPage: 1,
    totalDocument: undefined,
  });
  const { bech32Address } = useCosmosWallet();
  const { data: histories, isLoading: isHistoryLoading } = usePortfolioHistory({
    enabled: true,
    userAddress: bech32Address,
    page: pagination.currentPage,
    typeFilter,
  });

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      totalPage: histories ? histories.pagination.totalPages : 1,
      totalDocument: histories ? histories.pagination.total : 1,
    }));
  }, [isHistoryLoading]);
  return (
    <div>
      <p>Histories</p>
      <div className="flex flex-col gap-2 bg-[#f9f9f9] p-4 dark:bg-[#252525]">
        <div className="flex w-full justify-end">
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value as string);
              setPagination({
                currentPage: 1,
                totalDocument: 0,
                totalPage: 1,
              });
            }}
          >
            <SelectTrigger className="h-[42px] w-[180px] rounded-lg bg-[#FDFEFE] font-bold dark:bg-[#121921] dark:text-white">
              <SelectValue placeholder={typeFilter} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {typesFilter.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className={`font-bold dark:text-white`}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="flex w-full flex-col gap-1">
            <div className="flex items-center rounded-xl border-[1px] border-[#1b5f79] px-8 py-4">
              <div className="w-[25%] px-2 text-left">Date</div>
              <div className="w-[15%] px-2 text-left">Type</div>
              <div className="w-[20%] px-2 text-center">From</div>
              <div className="w-[15%] px-2 text-right">Amount</div>
              <div className="w-[25%] px-2 text-center">TxHash</div>
            </div>
            {(histories?.data ?? []).length === 0 ? (
              <div className="mt-5 flex flex-col items-center gap-6">
                <EmptyIcon />
                <p className="text-2xl dark:text-white">
                  You have no pending redeem request
                </p>
              </div>
            ) : (
              (histories?.data ?? []).map((history) => (
                <HistoryItem key={history.hash} history={history} />
              ))
            )}
          </div>
        </div>
        <ShadcnPagination
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </div>
  );
};
