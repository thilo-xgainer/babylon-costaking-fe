export const ONE_SECOND = 1000;
export const ONE_MINUTE = 60 * ONE_SECOND;

export const API_DEFAULT_RETRY_COUNT = 3;
export const API_DEFAULT_RETRY_DELAY = 3.5; // seconds

export const DELEGATION_ACTIONS = {
  STAKE: "STAKE",
  UNBOND: "UNBOND",
  WITHDRAW_ON_EARLY_UNBONDING: "WITHDRAW_ON_EARLY_UNBONDING",
  WITHDRAW_ON_TIMELOCK: "WITHDRAW_ON_TIMELOCK",
  WITHDRAW_ON_TIMELOCK_SLASHING: "WITHDRAW_ON_TIMELOCK_SLASHING",
  WITHDRAW_ON_EARLY_UNBONDING_SLASHING: "WITHDRAW_ON_EARLY_UNBONDING_SLASHING",
} as const;

export const DOCUMENTATION_LINKS = {
  TECHNICAL_PRELIMINARIES:
    "https://babylonlabs.io/blog/technical-preliminaries-of-bitcoin-staking",
} as const;

export const BBN_FEE_AMOUNT = process.env.REACT_APP_BBN_FEE_AMOUNT;

export const MEMPOOL_API =
  process.env.REACT_APP_MEMPOOL_API || "https://mempool.space";

export const STAKING_DISABLED =
  process.env.REACT_APP_STAKING_DISABLED === "true";

export const BABYLON_EXPLORER = process.env.REACT_APP_BABYLON_EXPLORER ?? "";

export const REPLAYS_ON_ERROR_RATE = parseFloat(
  process.env.REACT_APP_REPLAYS_RATE ?? "0.05",
);

export const DEFAULT_MAX_FINALITY_PROVIDERS = 1;

/**
 * Default Bitcoin confirmation depth required for transactions
 * Used when network info is not available
 */
export const DEFAULT_CONFIRMATION_DEPTH = 30;

/**
 * Modal close animation delay in milliseconds
 * Used to prevent visual flicker when resetting state during modal close
 */
export const MODAL_CLOSE_DELAY = 400;

/**
 * Staking expansion operation types
 */
export const EXPANSION_OPERATIONS = {
  ADD_BSN_FP: "ADD_BSN_FP",
  RENEW_TIMELOCK: "RENEW_TIMELOCK",
};

/**
 * Shared EOI steps used across staking workflows
 */
export enum EOIStep {
  /** EOI signing steps - these follow the same pattern across workflows */
  EOI_STAKING_SLASHING = "eoi-staking-slashing",
  EOI_UNBONDING_SLASHING = "eoi-unbonding-slashing",
  EOI_PROOF_OF_POSSESSION = "eoi-proof-of-possession",
  EOI_SIGN_BBN = "eoi-sign-bbn",
  EOI_SEND_BBN = "eoi-send-bbn",
}

/**
 * Base staking workflow steps shared across different staking types
 */
export enum BaseStakingStep {
  /** Preview step showing staking details before signing */
  PREVIEW = "preview",
  /** Verification and completion steps */
  VERIFYING = "verifying",
  VERIFIED = "verified",
  /** Feedback steps for user experience */
  FEEDBACK_SUCCESS = "feedback-success",
  FEEDBACK_CANCEL = "feedback-cancel",
}

export const MARKETPLACE_CONTRACT_ADDRESS =
  "bbn1r38w9kg337gu4t8ru9zlzmaugfuv08q7ja5wqnglvjk6epm3krus0mepeu";
export const ORDER_ADDRESS =
  "bbn16l8yy4y9yww56x4ds24fy0pdv5ewcc2crnw77elzfts272325hfqwpm4c3";
