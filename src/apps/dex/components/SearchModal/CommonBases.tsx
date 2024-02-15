import { FC } from "react";
import {
  ChainId,
  Currency,
  currencyEquals,
  XDC,
  Token,
} from "into-the-fathom-swap-sdk";
import { Box, styled, Typography } from "@mui/material";

import { SUGGESTED_BASES } from "apps/dex/constants";
import { AutoColumn } from "apps/dex/components/Column";
import QuestionHelper from "apps/dex/components/QuestionHelper";
import { AutoRow } from "apps/dex/components/Row";
import CurrencyLogo from "apps/dex/components/CurrencyLogo";

const BaseWrapper = styled(Box)<{ disable?: boolean }>`
  border-radius: 10px;
  display: flex;
  padding: 6px;

  align-items: center;
  :hover {
    cursor: ${({ disable }) => !disable && "pointer"};
    background-color: ${({ disable }) => !disable && "#061023"};
  }

  background-color: ${({ disable }) => disable && "#061023"};
  opacity: ${({ disable }) => disable && "0.4"};
`;

type CommonBasesProps = {
  chainId?: ChainId;
  selectedCurrency?: Currency | null;
  onSelect: (currency: Currency) => void;
};

const CommonBases: FC<CommonBasesProps> = ({
  chainId,
  onSelect,
  selectedCurrency,
}) => {
  const renderBaseToken = () => {
    return (
      <BaseWrapper
        onClick={() => {
          if (!selectedCurrency || !currencyEquals(selectedCurrency, XDC)) {
            onSelect(XDC);
          }
        }}
        disable={selectedCurrency === XDC}
      >
        <CurrencyLogo currency={XDC} style={{ marginRight: 8 }} />
        <Typography fontWeight={500} fontSize={16}>
          XDC
        </Typography>
      </BaseWrapper>
    );
  };

  return (
    <AutoColumn gap="md">
      <AutoRow>
        <Typography fontWeight={500} fontSize={14}>
          Common bases
        </Typography>
        <QuestionHelper text="These tokens are commonly paired with other tokens." />
      </AutoRow>
      <AutoRow gap="4px">
        {renderBaseToken()}
        {(chainId ? SUGGESTED_BASES[chainId] : []).map((token: Token) => {
          const selected =
            selectedCurrency instanceof Token &&
            selectedCurrency.address === token.address;
          return (
            <BaseWrapper
              onClick={() => !selected && onSelect(token)}
              disable={selected}
              key={token.address}
            >
              <CurrencyLogo currency={token} style={{ marginRight: 8 }} />
              <Typography fontWeight={500} fontSize={16}>
                {token.symbol}
              </Typography>
            </BaseWrapper>
          );
        })}
      </AutoRow>
    </AutoColumn>
  );
};

export default CommonBases;
