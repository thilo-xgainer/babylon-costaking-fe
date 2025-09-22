import { API_END_POINT } from "../constants";
import { Pagination } from "./getHistory";

export type Order = {
  id: number;
  address: string;
  owner: string;
  btcAmount: string;
};

export const getListOrder = async (): Promise<{
  data: Order[];
  pagination: Pagination;
}> => {
  const response = await fetch(`${API_END_POINT}/order`);
  const data = await response.json();
  return data;
};
