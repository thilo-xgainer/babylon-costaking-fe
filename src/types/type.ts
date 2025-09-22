export type PaginationType = {
  totalPage: number;
  currentPage: number;
  totalDocument: number | undefined;
};

export type TransactionStep = {
  name: "init" | "signing" | "progressing" | "success" | "error" | "rejected";
  txHash: string;
};
