import { API_END_POINT } from "../constants";
import { OrderHistory } from "./getHistory";

export const getPortfolioHistory = async (
  userAddress: string,
  page: number,
  limit: number,
  typeFilter: string,
): Promise<OrderHistory> => {
  const response = await fetch(
    `${API_END_POINT}/history/user/${userAddress}?page=${page}&limit=${limit}${typeFilter !== "all" ? `&type=${typeFilter}` : ""}`,
  );
  const data = await response.json();
  return data;
};
