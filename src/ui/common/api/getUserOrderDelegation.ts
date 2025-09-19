import { API_END_POINT } from "../constants";
import { Pagination } from "./getHistory";

export type DelegationItem = {
  _id: string;
  balance: number;
  withdrawable: number;
  pendingUnstaked: number;
  order: string;
  btcAmount: number;
};

export type Delegation = {
  data: DelegationItem[];
  pagination: Pagination;
};

export const getUserOrderDelegation = async (
  userAddress: string,
): Promise<Delegation> => {
  const response = await fetch(`${API_END_POINT}/order/user/${userAddress}`);
  const data = await response.json();
  return data;
};
