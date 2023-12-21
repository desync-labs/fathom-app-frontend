import { Text } from "rebass";
import {
  ChainId,
  Currency,
  currencyEquals,
  XDC,
  Token,
} from "into-the-fathom-swap-sdk";
import styled from "styled-components";

import { SUGGESTED_BASES } from "apps/dex/constants";
import { AutoColumn } from "apps/dex/components/Column";
import QuestionHelper from "apps/dex/components/QuestionHelper";
import { AutoRow } from "apps/dex/components/Row";
import CurrencyLogo from "apps/dex/components/CurrencyLogo";
import { FC } from "react";

const BaseWrapper = styled.div<{ disable?: boolean }>`
  border-radius: 10px;
  display: flex;
  padding: 6px;

  align-items: center;
  :hover {
    cursor: ${({ disable }) => !disable && "pointer"};
    background-color: ${({ theme, disable }) => !disable && theme.bg2};
  }

  background-color: ${({ theme, disable }) => disable && theme.bg2};
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
        <Text fontWeight={500} fontSize={16}>
          XDC
        </Text>
      </BaseWrapper>
    );
  };

  return (
    <AutoColumn gap="md">
      <AutoRow>
        <Text fontWeight={500} fontSize={14}>
          Common bases
        </Text>
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
              <Text fontWeight={500} fontSize={16}>
                {token.symbol}
              </Text>
            </BaseWrapper>
          );
        })}
      </AutoRow>
    </AutoColumn>
  );
};

export default CommonBases;
