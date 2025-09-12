// Default gas price for BABY
const DEFAULT_BBN_GAS_PRICE = 0.002;

// API URL configuration
export const getApiBaseUrl = (): string => {
  let apiUrl = process.env.REACT_APP_API_URL;

  if (!apiUrl) {
    throw new Error("REACT_APP_API_URL environment variable is not defined");
  }

  if (apiUrl === "/") {
    apiUrl = "";
  }

  return apiUrl;
};

// shouldDisplayTestingMsg function is used to check if the application is running in testing mode or not.
// Default to true if the environment variable is not set.
export const shouldDisplayTestingMsg = (): boolean => {
  return process.env.REACT_APP_DISPLAY_TESTING_MESSAGES?.toString() !== "false";
};

// getNetworkAppUrl function is used to get the network app url based on the environment
export const getNetworkAppUrl = (): string => {
  return shouldDisplayTestingMsg()
    ? "https://btcstaking.testnet.babylonchain.io"
    : "https://btcstaking.babylonlabs.io";
};

export const IS_FIXED_TERM_FIELD =
  process.env.REACT_APP_FIXED_STAKING_TERM === "true";

// BBN_GAS_PRICE is used to get the gas price for BABY
export const BBN_GAS_PRICE = (() => {
  const price = parseFloat(process.env.REACT_APP_BBN_GAS_PRICE || "");
  if (isNaN(price) || price <= 0 || price >= 1) {
    return DEFAULT_BBN_GAS_PRICE; // fallback to default if invalid
  }
  return price;
})();

// Disable the wallet by their name in the event of incident. split by comma.
// You can find the wallet name from the wallet provider.
export const getDisabledWallets = (): string[] => {
  return (
    process.env.REACT_APP_DISABLED_WALLETS?.split(",").map((w) => w.trim()) ||
    []
  );
};
