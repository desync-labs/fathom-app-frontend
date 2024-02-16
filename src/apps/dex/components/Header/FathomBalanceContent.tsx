import { FC } from "react";
import { NavLink } from "react-router-dom";
import { ChainId, TokenAmount } from "into-the-fathom-swap-sdk";
import BigNumber from "bignumber.js";
import { styled } from "@mui/material";

import usePricesContext from "context/prices";
import { formatPercentage } from "utils/format";
import { FTHM } from "apps/dex/constants";
import { useTotalSupply } from "apps/dex/data/TotalSupply";
import { useActiveWeb3React } from "apps/dex/hooks";
import {
  useAggregateFTHMBalance,
  useTokenBalance,
} from "apps/dex/state/wallet/hooks";
import { TYPE, FthmTokenAnimated } from "apps/dex/theme";
import { AutoColumn } from "apps/dex/components/Column";
import { RowBetween } from "apps/dex/components/Row";
import {
  Break,
  CardBGImage,
  CardNoise,
  CardSection,
  DataCard,
} from "apps/dex/components/earn/styled";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import tokenLogo from "apps/dex/assets/images/token-logo.svg";

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`;

const ModalUpper = styled(DataCard)`
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background: transparent;
  color: #0e0f15;
  padding: 0.5rem;
`;

const StyledClose = styled(CloseRoundedIcon)`
  position: absolute;
  right: 16px;
  top: 16px;
  color: #ffffff;

  :hover {
    cursor: pointer;
  }
`;

/**
 * Content for balance stats modal
 */
type FathomBalanceContent = {
  setShowFthmBalanceModal: any;
};

const FathomBalanceContent: FC<FathomBalanceContent> = ({
  setShowFthmBalanceModal,
}) => {
  const { account, chainId } = useActiveWeb3React();
  const fthm = chainId ? FTHM[chainId] : undefined;

  const { fthmPrice } = usePricesContext();

  const total = useAggregateFTHMBalance();
  const fthmBalance: TokenAmount | undefined = useTokenBalance(
    account ?? undefined,
    fthm
  );

  const totalSupply: TokenAmount | undefined = useTotalSupply(fthm);

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
              <TYPE.white>Total Supply</TYPE.white>
              <TYPE.white>
                {totalSupply?.toFixed(0, { groupSeparator: "," })}
              </TYPE.white>
            </RowBetween>
            {fthm && fthm.chainId === ChainId.XDC ? (
              <NavLink to={`/charts/token/${fthm.address}`}>
                View FTHM Analytics
              </NavLink>
            ) : null}
          </AutoColumn>
        </CardSection>
      </ModalUpper>
    </ContentWrapper>
  );
};

export default FathomBalanceContent;
