import { useOrderHistory } from "@/ui/common/hooks/client/api/useHistory";
import { useParams } from "react-router";
import { HistoryItem } from "./HistoryItem";
import { useEffect, useState } from "react";
import { useCosmosWallet } from "@/ui/common/context/wallet/CosmosWalletProvider";
import { PaginationType } from "@/types/type";
import { ShadcnPagination } from "../../ShadcnPagination";

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

export const History = () => {
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
  const { data: histories, isLoading: isHistoryLoading } = useOrderHistory({
    enabled: true,
    orderAddress: orderAddress ?? "",
    userAddress: activeTab === "my_history" ? bech32Address : "",
    page: pagination.currentPage,
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
        <div className="flex items-center justify-start gap-2">
          {tabs.map((tab) => (
            <div
              className={`cursor-pointer px-4 py-2 ${activeTab === tab.id ? "bg-[#2c6f8a] text-white" : "bg-[#e0e0e0] hover:opacity-80"}`}
              onClick={() => {
                if (activeTab !== tab.id) {
                  setActiveTab(tab.id);
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: 1,
                  }));
                }
              }}
            >
              {tab.title}
            </div>
          ))}
        </div>
        <div>
          <div className="flex w-full flex-col gap-1">
            <div className="flex items-center rounded-xl border-[1px] border-[#1b5f79] px-8 py-4">
              <div className="w-[25%] px-2 text-left">Date</div>
              <div className="w-[15%] px-2 text-left">Type</div>
              <div className="w-[20%] px-2 text-left">From</div>
              <div className="w-[15%] px-2 text-left">Amount</div>
              <div className="w-[25%] px-2 text-left">TxHash</div>
            </div>
            {(histories?.data ?? []).map((history) => (
              <HistoryItem key={history.hash} history={history} />
            ))}
          </div>
        </div>
      </div>

      <ShadcnPagination pagination={pagination} setPagination={setPagination} />
    </div>
  );
};
