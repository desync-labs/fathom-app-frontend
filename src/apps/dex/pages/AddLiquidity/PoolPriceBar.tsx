import { Currency, Percent, Price } from "into-the-fathom-swap-sdk";
import { FC, useContext } from "react";
import { Text } from "rebass";
import { ThemeContext } from "styled-components";
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
  const theme = useContext(ThemeContext);
  return (
    <AutoColumn gap="md">
      <AutoRow justify="space-around" gap="4px">
        <AutoColumn justify="center">
          <TYPE.white>{price?.toSignificant(6) ?? "-"}</TYPE.white>
          <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
            {currencies[Field.CURRENCY_B]?.symbol} per{" "}
            {currencies[Field.CURRENCY_A]?.symbol}
          </Text>
        </AutoColumn>
        <AutoColumn justify="center">
          <TYPE.white>{price?.invert()?.toSignificant(6) ?? "-"}</TYPE.white>
          <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
            {currencies[Field.CURRENCY_A]?.symbol} per{" "}
            {currencies[Field.CURRENCY_B]?.symbol}
          </Text>
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
          <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
            Share of Pool
          </Text>
        </AutoColumn>
      </AutoRow>
    </AutoColumn>
  );
};
