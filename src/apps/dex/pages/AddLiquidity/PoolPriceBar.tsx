import { FC } from "react";
import { Currency, Percent, Price } from "into-the-fathom-swap-sdk";
import { Typography } from "@mui/material";

import { AutoColumn } from "apps/dex/components/Column";
import { AutoRow } from "apps/dex/components/Row";
import { ONE_BIPS } from "apps/dex/constants";
import { Field } from "apps/dex/state/mint/actions";
import { TYPE } from "apps/dex/theme";

type PoolPriceBarProps = {
  currencies: { [field in Field]?: Currency };
  noLiquidity?: boolean;
  poolTokenPercentage?: Percent;
  price?: Price;
};

export const PoolPriceBar: FC<PoolPriceBarProps> = ({
  currencies,
  noLiquidity,
  poolTokenPercentage,
  price,
}) => {
  return (
    <AutoColumn gap="md">
      <AutoRow justify="space-around" gap="4px">
        <AutoColumn justify="center">
          <TYPE.white>{price?.toSignificant(6) ?? "-"}</TYPE.white>
          <Typography
            fontWeight={500}
            fontSize={14}
            sx={{ color: "#4F658C" }}
            pt={1}
          >
            {currencies[Field.CURRENCY_B]?.symbol} per{" "}
            {currencies[Field.CURRENCY_A]?.symbol}
          </Typography>
        </AutoColumn>
        <AutoColumn justify="center">
          <TYPE.white>{price?.invert()?.toSignificant(6) ?? "-"}</TYPE.white>
          <Typography
            fontWeight={500}
            fontSize={14}
            sx={{ color: "#4F658C" }}
            pt={1}
          >
            {currencies[Field.CURRENCY_A]?.symbol} per{" "}
            {currencies[Field.CURRENCY_B]?.symbol}
          </Typography>
        </AutoColumn>
        <AutoColumn justify="center">
          <TYPE.white>
            {noLiquidity && price
              ? "100"
              : (poolTokenPercentage?.lessThan(ONE_BIPS)
                  ? "<0.01"
                  : poolTokenPercentage?.toFixed(2)) ?? "0"}
            %
          </TYPE.white>
          <Typography
            fontWeight={500}
            fontSize={14}
            sx={{ color: "#4F658C" }}
            pt={1}
          >
            Share of Pool
          </Typography>
        </AutoColumn>
      </AutoRow>
    </AutoColumn>
  );
};
