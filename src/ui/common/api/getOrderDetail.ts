import { API_END_POINT } from "../constants";

export interface OrderDetail {
  id: number;
  address: string;
  owner: string;
  delegations: DelegationDetail[];
  btcAmount: number;
}

export interface DelegationDetail {
  staker_addr: string;
  btc_pk: string;
  fp_btc_pk_list: string[];
  staking_time: number;
  start_height: number;
  end_height: number;
  total_sat: string;
  staking_tx_hex: string;
  active: boolean;
  status_desc: string;
  unbonding_time: number;
  params_version: number;
  staking_tx_hash: string;
}

export const getOrderDetail = async (orderAddress: string) => {
  const response = await fetch(`${API_END_POINT}/order/${orderAddress}`);
  const data: OrderDetail[] = await response.json();
  return data;
};
