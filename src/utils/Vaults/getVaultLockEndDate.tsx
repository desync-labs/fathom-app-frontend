const TF_VAULT_ADDITIONS_LOCKED_DAYS =
  process.env.REACT_APP_TF_VAULT_ADDITIONS_LOCKED_DAYS;

const getVaultLockEndDate = (date: string) => {
  const result = new Date(Number(date) * 1000);
  result.setDate(result.getDate() + Number(TF_VAULT_ADDITIONS_LOCKED_DAYS));
  return result.getTime() / 1000;
};

export { getVaultLockEndDate };
