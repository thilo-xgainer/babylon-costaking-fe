import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export const formatTxid = (txid: string) => {
  const firstPart = txid.slice(0, 5);
  const lastPart = txid.slice(-5);
  return `${firstPart}...${lastPart}`;
};

export const formatAddress = (txid: string) => {
  if (!txid) return ``;
  const firstPart = txid.slice(0, 6);
  const lastPart = txid.slice(-6);
  return `${firstPart}...${lastPart}`;
};

export const formatBTCAddress = (txid: string) => {
  if (!txid) return ``;
  const firstPart = txid.slice(0, 13);
  const lastPart = txid.slice(-13);
  return `${firstPart}...${lastPart}`;
};

export const formatNumberEther = (x: any, y: number) => {
  return parseFloat(Number(x).toFixed(y));
};

export const formatLargeNumber = (value: number): string => {
  if (value > 1000000000) {
    const formatted = Math.floor((value / 1000000000) * 1e2) / 1e2;
    return formatted + "B";
  }
  if (value > 1000000) {
    const formatted = Math.floor((value / 1000000) * 1e2) / 1e2;
    return formatted + "M";
  }
  if (value > 1000) {
    const formatted = Math.floor((value / 1000) * 1e2) / 1e2;
    return formatted + "k";
  }
  return value.toFixed(1);
};

export const formatTime = (unlockTime: any | null) => {
  if (unlockTime === null) return null;
  if (typeof unlockTime === "string") {
    return dayjs(unlockTime).format("DD MMM YYYY");
  }
  return dayjs.utc(Number(unlockTime) * 1000).format("DD MMM YYYY");
};

export const formatTimeDetail = (unlockTime: any | null) => {
  if (unlockTime === null) return null;

  return dayjs.utc(Number(unlockTime) * 1000).format("MMMM DD, YYYY");
};

export const formatTimeHistory = (unlockTime: any | null) => {
  if (unlockTime === null) return null;

  if (typeof unlockTime === "string") {
    return dayjs.utc(unlockTime).format("DD MMM YYYY, HH:mm");
  }
  return dayjs.utc(Number(unlockTime) * 1000).format("DD MMM YYYY, HH:mm");
};

export const getTimeAgo = (
  timestamp: number | string | null | undefined,
): string => {
  if (!timestamp) return ``;
  const now = new Date();

  let time: Date;

  if (typeof timestamp === "string") {
    time = new Date(timestamp);
  } else {
    time = new Date(timestamp * 1000);
  }

  const secondsAgo = Math.floor((now.getTime() - time.getTime()) / 1000);
  if (secondsAgo < 60) {
    return `${secondsAgo} second${secondsAgo === 1 ? "" : "s"} ago`;
  }

  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) {
    return `${minutesAgo} minute${minutesAgo === 1 ? "" : "s"} ago`;
  }

  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
    return `${hoursAgo} hour${hoursAgo === 1 ? "" : "s"} ago`;
  }

  const daysAgo = Math.floor(hoursAgo / 24);
  return `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`;
};

export const timeRemaining = (
  unlockTime?: number | null,
  charSpaceing?: string,
) => {
  if (!unlockTime) return ``;
  const now = Math.ceil(Date.now() / 1000);
  const timeDiff = unlockTime - now;

  if (timeDiff <= 0) {
    return ``;
  }

  const days = Math.floor(timeDiff / (24 * 3600));
  const hours = Math.floor((timeDiff % (24 * 3600)) / 3600);
  const minutes = Math.floor((timeDiff % 3600) / 60);
  const seconds = timeDiff % 60;
  const spacing = charSpaceing ? charSpaceing : " ";

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    return `${hours}h${spacing}${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m${spacing}${seconds}s`;
  } else if (seconds > 0) {
    return `${seconds}s`;
  } else {
    return ``;
  }
};

// export const formatTimeWithdraw = (unlockTime: any | null) => {
//   if (unlockTime === null) return null

//   if (typeof unlockTime === 'string') {
//     return dayjs.utc(unlockTime).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
//   }
//   return dayjs.utc(Number(unlockTime) * 1000).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
// }

// export const formatTimeWithdrawMobile = (unlockTime: any | null) => {
//   if (unlockTime === null) return null

//   if (typeof unlockTime === 'string') {
//     return dayjs.utc(unlockTime).format('YYYY-MM-DDTHH:mm')
//   }
//   return dayjs.utc(Number(unlockTime) * 1000).format('YYYY-MM-DDTHH:mm')
// }

export const formatTVL = (number: number) => {
  const options =
    number > 1000
      ? { minimumFractionDigits: 0, maximumFractionDigits: 0 }
      : { minimumFractionDigits: 0, maximumFractionDigits: 3 };

  return number.toLocaleString("en-US", options);
};

// export const formatEtherNumber = (n: bigint, opt = 3) => {
//   return parseFloat(Number(formatEther(n)).toFixed(opt)).toLocaleString('en-US')
// }

export const formatAmount = (
  amount: number | bigint | null | undefined | string,
  maximumFractionDigits: number = 2,
): string => {
  if (amount === null || amount === undefined || isNaN(Number(amount)))
    return "-";

  const num = Number(amount);
  if (num === 0) return "0";

  let rounded = Number(num.toFixed(maximumFractionDigits));
  const diffPercent = Math.abs((rounded - num) / num) * 100;

  let decimals = maximumFractionDigits;

  if (diffPercent >= 5) {
    while (diffPercent >= 5 && decimals < 10) {
      decimals++;
      rounded = Number(num.toFixed(decimals));
      const newDiff = Math.abs((rounded - num) / num) * 100;
      if (newDiff < 5) break;
    }
  }

  return rounded.toLocaleString("en-US", {
    maximumFractionDigits: decimals,
  });
};
