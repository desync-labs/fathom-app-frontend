import { Navigate, useLocation, useParams } from "react-router-dom";
import AddLiquidity from "apps/dex/pages/AddLiquidity";

const OLD_PATH_STRUCTURE = /^(0x[a-fA-F0-9]{40})-(0x[a-fA-F0-9]{40})$/;
export function RedirectOldAddLiquidityPathStructure() {
  const { currencyIdA } = useParams();
  const location = useLocation();
  const match = currencyIdA?.match(OLD_PATH_STRUCTURE);
  if (match?.length) {
    return <Navigate to={`/swap/add/${match[1]}/${match[2]}`} />;
  }

  return <AddLiquidity {...location} />;
}

export function RedirectDuplicateTokenIds() {
  const { currencyIdA, currencyIdB } = useParams();
  const location = useLocation();
  if (currencyIdA?.toLowerCase() === currencyIdB?.toLowerCase()) {
    return <Navigate to={`/swap/add/${currencyIdA}`} />;
  }
  return <AddLiquidity {...location} />;
}
