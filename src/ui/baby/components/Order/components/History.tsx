import { useParams } from "react-router";
import { useState } from "react";

import { useOrderHistory } from "@/ui/common/hooks/client/api/useOrderHistory";
import { useCosmosWallet } from "@/ui/common/context/wallet/CosmosWalletProvider";
import { PaginationType } from "@/types/type";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/common/components/Select";
import { EmptyIcon } from "@/ui/icons/EmptyIcon";
import { useUserHistory } from "@/ui/common/hooks/client/useUserHistory";

import { ShadcnPagination } from "../../ShadcnPagination";

import { HistoryItem } from "./HistoryItem";

type Tab = {
  id: "history" | "my_history";
  title: string;
};

const tabs: Tab[] = [
  {
    id: "history",
    title: "History",
  },
  {
    id: "my_history",
    title: "My history",
  },
];

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
  const [activeTab, setActiveTab] = useState<"history" | "my_history">(
    "history",
  );
  const { bech32Address } = useCosmosWallet();
  const { orderAddress } = useParams();
  const { data: histories } = useOrderHistory({
    orderAddress: orderAddress ?? "",
    page: pagination.currentPage,
    typeFilter,
    enabled: activeTab === "history",
  });

  const { data: userHistories } = useUserHistory({
    userAddress: bech32Address,
    orderAddress: orderAddress ?? "",
    page: pagination.currentPage,
    typeFilter,
    enabled: activeTab === "my_history" && !!bech32Address,
  });

  return (
    <div>
      <p>Histories</p>
      <div className="flex flex-col gap-2 bg-[#f9f9f9] p-4 dark:bg-[#252525]">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-2">
            {tabs.map((tab) => (
              <div
                className={`cursor-pointer px-4 py-2 ${activeTab === tab.id ? "bg-[#2c6f8a] text-white" : "bg-[#e0e0e0] hover:opacity-80"}`}
                onClick={() => {
                  if (activeTab !== tab.id) {
                    setActiveTab(tab.id);
                    setPagination({
                      currentPage: 1,
                      totalPage: 1,
                      totalDocument: undefined,
                    });
                  }
                }}
              >
                {tab.title}
              </div>
            ))}
          </div>
          <div>
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
            {(
              (activeTab === "history"
                ? histories?.data
                : userHistories?.data) ?? []).length === 0 ? (
              <div className="mt-5 flex flex-col items-center gap-6">
                <EmptyIcon />
                <p className="text-2xl dark:text-white">
                  You have no pending redeem request
                </p>
              </div>
            ) : (
              (histories?.data ?? []
            ).map((history) => (
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
      {histories && (
        <ShadcnPagination
          pagination={pagination}
          setPagination={setPagination}
        />
      )}
    </div>
  );
};
