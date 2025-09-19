import { API_END_POINT } from "../constants";

export type HistoryItemType = {
  _id: string;
  hash: string;
  user: string;
  order: string;
  height: number;
  amount: string;
  user_deposit_increased: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  type: "stake" | "unstake" | "withdraw" | "claim";
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type OrderHistory = {
  data: HistoryItemType[];
  pagination: Pagination;
};

export const getOrderHistory = async (
  orderAddress: string,
  userAddress: string,
  page: number,
  limit: number,
  typeFilter: string,
): Promise<OrderHistory> => {
  const response = await fetch(
    `${API_END_POINT}/history/order/${orderAddress}?page=${page}&limit=${limit}${typeFilter !== "all" ? `&type=${typeFilter}` : ""}${userAddress !== "" ? `&user=${userAddress}` : ""}`,
  );
  const data = await response.json();
  return data;
};
