import { ChainId, TokenAmount } from "into-the-fathom-swap-sdk";
import { useMemo } from "react";
import { X } from "react-feather";
import styled from "styled-components";
import tokenLogo from "apps/dex/assets/images/token-logo.svg";
import { FTHM } from "apps/dex/constants";
import { useTotalSupply } from "apps/dex/data/TotalSupply";
import { useActiveWeb3React } from "apps/dex/hooks";
import useCurrentBlockTimestamp from "apps/dex/hooks/useCurrentBlockTimestamp";
import {
  useAggregateUniBalance,
  useTokenBalance,
} from "apps/dex/state/wallet/hooks";
import { ExternalLink, TYPE, FthmTokenAnimated } from "apps/dex/theme";
import { computeUniCirculation } from "apps/dex/utils/computeUniCirculation";
import { AutoColumn } from "apps/dex/components/Column";
import { RowBetween } from "apps/dex/components/Row";
import {
  Break,
  CardBGImage,
  CardNoise,
  CardSection,
  DataCard,
} from "apps/dex/components/earn/styled";
import usePricesContext from "context/prices";
import { formatPercentage } from "utils/format";
import BigNumber from "bignumber.js";

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`;

const ModalUpper = styled(DataCard)`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: ${({ theme }) => theme.bg7};
  color: ${({ theme }) => theme.text6};
  padding: 0.5rem;
`;

const StyledClose = styled(X)`
  position: absolute;
  right: 16px;
  top: 16px;

  :hover {
    cursor: pointer;
  }
`;

/**
 * Content for balance stats modal
 */
export default function FathomBalanceContent({
  setShowFthmBalanceModal,
}: {
  setShowFthmBalanceModal: any;
}) {
  const { account, chainId } = useActiveWeb3React();
  const fthm = chainId ? FTHM[chainId] : undefined;

  const { fthmPrice } = usePricesContext();

  const total = useAggregateUniBalance();
  const fthmBalance: TokenAmount | undefined = useTokenBalance(
    account ?? undefined,
    fthm
  );

  const totalSupply: TokenAmount | undefined = useTotalSupply(fthm);
  const blockTimestamp = useCurrentBlockTimestamp();
  const circulation: TokenAmount | undefined = useMemo(
    () =>
      blockTimestamp && fthm && chainId === ChainId.XDC
        ? computeUniCirculation(fthm, blockTimestamp, undefined)
        : totalSupply,
    [blockTimestamp, chainId, totalSupply, fthm]
  );

  return (
    <ContentWrapper gap="lg">
      <ModalUpper>
        <CardBGImage />
        <CardNoise />
        <CardSection gap="md">
          <RowBetween>
            <TYPE.white>Your FTHM Breakdown</TYPE.white>
            <StyledClose
              stroke="white"
              onClick={() => setShowFthmBalanceModal(false)}
            />
          </RowBetween>
        </CardSection>
        <Break />
        {account && (
          <>
            <CardSection gap="sm">
              <AutoColumn
                gap="md"
                justify="center"
                style={{ marginBottom: "20px" }}
              >
                <FthmTokenAnimated width="48px" src={tokenLogo} />{" "}
                <TYPE.white fontSize={48} fontWeight={600}>
                  {total?.toFixed(2, { groupSeparator: "," })}
                </TYPE.white>
              </AutoColumn>
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white>Balance:</TYPE.white>
                  <TYPE.white>
                    {fthmBalance?.toFixed(2, { groupSeparator: "," })}
                  </TYPE.white>
                </RowBetween>
              </AutoColumn>
            </CardSection>
            <Break />
          </>
        )}
        <CardSection gap="sm">
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.white>FTHM price:</TYPE.white>
              <TYPE.white>
                <>
                  {fthmPrice ? "$" : ""}{" "}
                  {fthmPrice
                    ? formatPercentage(
                        BigNumber(fthmPrice)
                          .dividedBy(10 ** 18)
                          .toNumber()
                      )
                    : "-"}
                </>
              </TYPE.white>
            </RowBetween>
            <RowBetween>
              <TYPE.white>FTHM in circulation:</TYPE.white>
              <TYPE.white>
                {circulation?.toFixed(0, { groupSeparator: "," })}
              </TYPE.white>
            </RowBetween>
            <RowBetween>
              <TYPE.white>Total Supply</TYPE.white>
              <TYPE.white>
                {totalSupply?.toFixed(0, { groupSeparator: "," })}
              </TYPE.white>
            </RowBetween>
            {fthm && fthm.chainId === ChainId.XDC ? (
              <ExternalLink
                href={`https://charts.fathom.fi/token/${fthm.address}`}
              >
                View FTHM Analytics
              </ExternalLink>
            ) : null}
          </AutoColumn>
        </CardSection>
      </ModalUpper>
    </ContentWrapper>
  );
}
