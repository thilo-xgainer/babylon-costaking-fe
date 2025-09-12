export const getCommitHash = () => {
  return process.env.REACT_APP_COMMIT_HASH || "development";
};
