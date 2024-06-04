import { FC } from "react";
import { Price } from "into-the-fathom-swap-sdk";
import { Typography } from "@mui/material";
import { StyledBalanceMaxMini } from "apps/dex/components/swap/styleds";

import RepeatRoundedIcon from "@mui/icons-material/RepeatRounded";

interface TradePriceProps {
  price?: Price;
  showInverted: boolean;
  setShowInverted: (showInverted: boolean) => void;
}

const TradePrice: FC<TradePriceProps> = ({
  price,
  showInverted,
  setShowInverted,
}) => {
  const formattedPrice = showInverted
    ? price?.toSignificant(6)
    : price?.invert()?.toSignificant(6);

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency);
  const label = showInverted
    ? `${price?.quoteCurrency?.symbol} per ${price?.baseCurrency?.symbol}`
    : `${price?.baseCurrency?.symbol} per ${price?.quoteCurrency?.symbol}`;

  return (
    <Typography
      fontWeight={500}
      fontSize={14}
      color={"#4F658C"}
      style={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
    >
      {show ? (
        <>
          {formattedPrice ?? "-"} {label}
          <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
            <RepeatRoundedIcon sx={{ width: "18px", height: "18px" }} />
          </StyledBalanceMaxMini>
        </>
      ) : (
        "-"
      )}
    </Typography>
  );
};

export default TradePrice;
