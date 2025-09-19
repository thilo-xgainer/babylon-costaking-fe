import { useState } from "react";

import { Container } from "@/ui/common/components/Container/Container";
import { Tabs } from "@/ui/common/components/Tabs";

import { Information } from "./components/Information";
import { MyAssets } from "./components/MyAssets";
import { OrderTab } from "./components/OrderTab";
import { BtcStaking } from "./components/BtcStaking";
import { History } from "./components/History";

type TabId = "baby" | "btc";

const tabItems = [
  {
    id: "baby",
    label: "Babby",
    content: <OrderTab />,
  },
  {
    id: "btc",
    label: "Your Order",
    content: <BtcStaking />,
  },
  {
    id: "history",
    label: "My Transaction",
    content: <History />,
  },
];
export const PortfolioPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>("baby");
  return (
    <Container
      as="main"
      className="mx-auto flex max-w-[1024px] flex-1 flex-col gap-[3rem] pb-24"
    >
      <div className="flex flex-col items-center gap-1">
        <p className="text-center text-4xl font-semibold">My Portfolio</p>
        <p>Track all your stake position in one place</p>
      </div>
      <Information />
      <MyAssets />

      <div>
        <Tabs
          items={tabItems}
          defaultActiveTab="baby"
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as TabId)}
        />
      </div>
    </Container>
  );
};
