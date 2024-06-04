import { FC } from "react";
import {
  Currency,
  CurrencyAmount,
  Fraction,
  Percent,
} from "into-the-fathom-swap-sdk";
import { Typography } from "@mui/material";

import { ButtonPrimary } from "apps/dex/components/Button";
import { RowBetween, RowFixed } from "apps/dex/components/Row";
import CurrencyLogo from "apps/dex/components/CurrencyLogo";
import { Field } from "apps/dex/state/mint/actions";
import { TYPE } from "apps/dex/theme";

type ConfirmAddModalBottomProps = {
  noLiquidity?: boolean;
  price?: Fraction;
  currencies: { [field in Field]?: Currency };
  parsedAmounts: { [field in Field]?: CurrencyAmount };
  poolTokenPercentage?: Percent;
  onAdd: () => void;
};

export const ConfirmAddModalBottom: FC<ConfirmAddModalBottomProps> = ({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd,
}) => {
  return (
    <>
      <RowBetween>
        <TYPE.body>{currencies[Field.CURRENCY_A]?.symbol} Deposited</TYPE.body>
        <RowFixed>
          <CurrencyLogo
            currency={currencies[Field.CURRENCY_A]}
            style={{ marginRight: "8px" }}
          />
          <TYPE.body>
            {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
          </TYPE.body>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <TYPE.body>{currencies[Field.CURRENCY_B]?.symbol} Deposited</TYPE.body>
        <RowFixed>
          <CurrencyLogo
            currency={currencies[Field.CURRENCY_B]}
            style={{ marginRight: "8px" }}
          />
          <TYPE.body>
            {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
          </TYPE.body>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <TYPE.body>Rates</TYPE.body>
        <TYPE.body>
          {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(
            4
          )} ${currencies[Field.CURRENCY_B]?.symbol}`}
        </TYPE.body>
      </RowBetween>
      <RowBetween style={{ justifyContent: "flex-end" }}>
        <TYPE.body>
          {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price
            ?.invert()
            .toSignificant(4)} ${currencies[Field.CURRENCY_A]?.symbol}`}
        </TYPE.body>
      </RowBetween>
      <RowBetween>
        <TYPE.body>Share of Pool:</TYPE.body>
        <TYPE.body>
          {noLiquidity ? "100" : poolTokenPercentage?.toSignificant(4)}%
        </TYPE.body>
      </RowBetween>
      <ButtonPrimary style={{ margin: "20px 0 0 0" }} onClick={onAdd}>
        <Typography fontWeight={500} fontSize={20}>
          {noLiquidity ? "Create Pool & Supply" : "Confirm Supply"}
        </Typography>
      </ButtonPrimary>
    </>
  );
};
