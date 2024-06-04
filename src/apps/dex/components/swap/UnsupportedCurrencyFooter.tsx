import { FC, useState } from "react";
import { Currency, Token } from "into-the-fathom-swap-sdk";
import { Box, styled } from "@mui/material";
import { TYPE, CloseIcon, ExternalLink } from "apps/dex/theme";
import { ButtonEmpty } from "apps/dex/components/Button";
import Modal from "apps/dex/components/Modal";
import Card, { OutlineCard } from "apps/dex/components/Card";
import { RowBetween, AutoRow } from "apps/dex/components/Row";
import { AutoColumn } from "apps/dex/components/Column";
import CurrencyLogo from "apps/dex/components/CurrencyLogo";
import { useActiveWeb3React } from "apps/dex/hooks";
import { getBlockScanLink } from "apps/dex/utils";
import { wrappedCurrency } from "apps/dex/utils/wrappedCurrency";
import { useSupportedTokens } from "apps/dex/hooks/Tokens";

const DetailsFooter = styled(Box)<{ show: boolean }>`
  padding-top: ${({ show }) => (show ? "calc(16px + 2rem)" : "0")};
  padding-bottom: ${({ show }) => (show ? "20px" : "0")};
  margin-top: ${({ show }) => (show ? "-2rem" : "0")};
  width: 100%;
  max-width: 400px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  color: #4f658c;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: -1;

  transform: ${({ show }) => (show ? "translateY(0%)" : "translateY(-100%)")};
  transition: transform 300ms ease-in-out;
  text-align: center;
`;

const AddressText = styled(TYPE.blue)`
  font-size: 12px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 10px;
  }
`;

type UnsupportedCurrencyFooterProps = {
  show: boolean;
  currencies: (Currency | undefined)[];
};

const UnsupportedCurrencyFooter: FC<UnsupportedCurrencyFooterProps> = ({
  show,
  currencies,
}) => {
  const { chainId } = useActiveWeb3React();
  const [showDetails, setShowDetails] = useState(false);

  const tokens =
    chainId && currencies
      ? currencies.map((currency) => {
          return wrappedCurrency(currency, chainId);
        })
      : [];

  const supportedTokens: { [address: string]: Token } = useSupportedTokens();

  return (
    <DetailsFooter show={show}>
      <Modal isOpen={showDetails} onDismiss={() => setShowDetails(false)}>
        <Card padding="2rem">
          <AutoColumn gap="lg">
            <RowBetween>
              <TYPE.mediumHeader>Unsupported Assets</TYPE.mediumHeader>
              <CloseIcon onClick={() => setShowDetails(false)} />
            </RowBetween>
            {tokens.map((token) => {
              return (
                token &&
                supportedTokens &&
                !Object.keys(supportedTokens).includes(token.address) && (
                  <OutlineCard key={token.address?.concat("not-supported")}>
                    <AutoColumn gap="10px">
                      <AutoRow align="center">
                        <CurrencyLogo currency={token} size={"24px"} />
                        <TYPE.body fontWeight={500}>{token.symbol}</TYPE.body>
                      </AutoRow>
                      {chainId && (
                        <ExternalLink
                          href={getBlockScanLink(
                            chainId,
                            token.address,
                            "address"
                          )}
                        >
                          <AddressText>{token.address}</AddressText>
                        </ExternalLink>
                      )}
                    </AutoColumn>
                  </OutlineCard>
                )
              );
            })}
            <AutoColumn gap="lg">
              <TYPE.body fontWeight={500}>
                Some assets are not available through this interface because
                they may not work well with our smart contract or we are unable
                to allow trading for legal reasons.
              </TYPE.body>
            </AutoColumn>
          </AutoColumn>
        </Card>
      </Modal>
      <ButtonEmpty padding={"0"} onClick={() => setShowDetails(true)}>
        <TYPE.blue>Read more about unsupported assets</TYPE.blue>
      </ButtonEmpty>
    </DetailsFooter>
  );
};

export default UnsupportedCurrencyFooter;
