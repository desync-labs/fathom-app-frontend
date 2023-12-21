import { Navigate, useParams } from "react-router-dom";

const OLD_PATH_STRUCTURE = /^(0x[a-fA-F0-9]{40})-(0x[a-fA-F0-9]{40})$/;

export const RedirectOldRemoveLiquidityPathStructure = () => {
  const { tokens } = useParams();
  if (!OLD_PATH_STRUCTURE.test(tokens as string)) {
    return <Navigate to={"/swap/pool"} />;
  }
  const [currency0, currency1] = tokens?.split("-") as string[];

  return <Navigate to={`/swap/remove/${currency0}/${currency1}`} />;
};
