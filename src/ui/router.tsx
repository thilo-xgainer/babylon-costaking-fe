import { Navigate, Route, Routes } from "react-router";

import BabyLayout from "./baby/layout";
import Layout from "./common/layout";
import NotFound from "./common/not-found";
import BTCStaking from "./common/page";
import { OrderList } from "./baby/components/OrderList";
import Order from "./baby/components/Order";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="btc" replace />} />
        <Route path="btc" element={<BTCStaking />} />
        <Route element={<BabyLayout />}>
          <Route path="order" element={<OrderList />} />
          <Route path="order/:orderAddress" element={<Order />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
