import { getFrozenProposalLink } from "apps/lending/components/infoTooltips/FrozenTooltip";
import { Link } from "apps/lending/components/primitives/Link";
import { FC } from "react";

interface BorrowDisabledWarningProps {
  symbol: string;
  currentMarket: string;
}
export const BorrowDisabledWarning: FC<BorrowDisabledWarningProps> = ({
  symbol,
  currentMarket,
}) => {
  return (
    <>
      {" "}
      Borrowing is disabled due to an Fathom community decision.{" "}
      <Link
        href={getFrozenProposalLink(symbol, currentMarket)}
        sx={{ textDecoration: "underline" }}
      >
        More details
      </Link>
    </>
  );
};
