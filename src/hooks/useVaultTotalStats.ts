import { useState } from "react";

const useVaultList = () => {
  const [totalDeposited, setTotalDeposited] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  return {
    totalDeposited,
    totalEarned,
  };
};

export default useVaultList;
