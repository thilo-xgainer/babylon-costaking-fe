import { useWalletConnect } from "@babylonlabs-io/wallet-connector";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { AuthGuard } from "@/ui/common/components/Common/AuthGuard";
import { Container } from "@/ui/common/components/Container/Container";
import { Tabs } from "@/ui/common/components/Tabs";
import { useHealthCheck } from "@/ui/common/hooks/useHealthCheck";
import { PendingOperationsProvider } from "@/ui/baby/hooks/services/usePendingOperationsService";
import StakingForm from "@/ui/baby/widgets/StakingForm";
import { Redeem } from "@/ui/baby/components/RedeemCard";
import { WithdrawCard } from "@/ui/baby/components/WithdrawCard";
import { useCosmosWallet } from "@/ui/common/context/wallet/CosmosWalletProvider";
import { Rewards } from "@/ui/common/components/Rewards";
import { useOrderList } from "@/ui/baby/hooks/services/useOrderList";

type TabId = "stake" | "redeem" | "withdraw" | "rewards";

export default function Order() {
  return (
    <PendingOperationsProvider>
      <OrderContent />
    </PendingOperationsProvider>
  );
}

function OrderContent() {
  const [activeTab, setActiveTab] = useState<TabId>("stake");
  const { connected } = useWalletConnect();
  const { isGeoBlocked } = useHealthCheck();
  const { bech32Address } = useCosmosWallet();
  const { orderAddress } = useParams();
  const { data: orderList } = useOrderList();

  useEffect(() => {
    if (!connected) {
      setActiveTab("stake");
    }
  }, [connected]);

  useEffect(() => {
    if (isGeoBlocked) {
      setActiveTab("stake");
    }
  }, [isGeoBlocked, activeTab]);

  const tabItems = [
    {
      id: "stake",
      label: "Stake",
      content: <StakingForm isGeoBlocked={isGeoBlocked} />,
    },
    {
      id: "redeem",
      label: "Redeem",
      content: <Redeem isGeoBlocked={isGeoBlocked} />,
    },
    {
      id: "withdraw",
      label: "Withdraw",
      content: <WithdrawCard />,
    },
  ];

  if (
    orderAddress &&
    bech32Address &&
    orderList.find(
      (order) =>
        order.address === orderAddress && order.owner === bech32Address,
    )
  ) {
    tabItems.push({
      id: "rewards",
      label: "BTC Rewards",
      content: <Rewards />,
    });
  }

  const fallbackTabItems = [
    {
      id: "stake",
      label: "Stake",
      content: <StakingForm isGeoBlocked={isGeoBlocked} />,
    },
  ];

  const fallbackContent = (
    <Container
      as="main"
      className="mx-auto flex max-w-[760px] flex-1 flex-col gap-[3rem] pb-24"
    >
      <Tabs items={fallbackTabItems} defaultActiveTab="stake" />
    </Container>
  );

  return (
    <AuthGuard fallback={fallbackContent} geoBlocked={isGeoBlocked}>
      <Container
        as="main"
        className="mx-auto flex max-w-[760px] flex-1 flex-col gap-[3rem] pb-24"
      >
        <Tabs
          items={tabItems}
          defaultActiveTab="stake"
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as TabId)}
        />
      </Container>
    </AuthGuard>
  );
}
