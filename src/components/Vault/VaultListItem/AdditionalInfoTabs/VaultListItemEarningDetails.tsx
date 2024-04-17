import { FC, memo } from "react";
import BigNumber from "bignumber.js";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { IVault } from "fathom-sdk";
import { getTokenLogoURL } from "utils/tokenLogo";
import usePricesContext from "context/prices";
import useSharedContext from "context/shared";
import { formatNumber, formatPercentage } from "utils/format";
import { useApr, useAprNumber } from "hooks/useApr";
import { vaultTitle } from "utils/getVaultTitleAndDescription";

const VaultTitle = styled("div")`
  color: #5a81ff;
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
`;

const VaultInfo = styled("div")`
  display: flex;
  gap: 40px;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 20px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    display: block;
  }
`;

const TotalTokens = styled("div")`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  line-height: 20px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    justify-content: space-between;
    margin-bottom: 5px;

    span {
      text-align: end;
      align-items: end;
    }
  }
`;

const Pooled = styled("div")`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  line-height: 20px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    justify-content: space-between;
    margin-bottom: 5px;
  }
`;

const PoolShare = styled("div")`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  line-height: 20px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    justify-content: space-between;
    margin-bottom: 5px;
  }
`;

const VaultInfoStats = styled("div")`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const Apr = styled("div")`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-transform: uppercase;
  color: #fff;

  span {
    font-weight: normal;
    text-transform: none;
    font-size: 14px;
    line-height: 20px;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
  }
`;

const Approx = styled("div")`
  font-size: 14px;
  line-height: 20px;
  color: #8ea4cc;
`;

const Token = styled("div")`
  display: flex;
  align-items: center;
  gap: 8px;
`;

type VaultListItemFarmingDetailsProps = {
  vaultItemData: IVault;
  vaultPosition?: any;
};

const VaultListItemEarningDetails: FC<VaultListItemFarmingDetailsProps> = ({
  vaultItemData,
  vaultPosition,
}) => {
  const { token, shareToken, sharesSupply } = vaultItemData;
  const formattedApr = useApr(vaultItemData);
  const aprNumber = useAprNumber(vaultItemData);
  const { balancePosition, balanceShares } = vaultPosition;
  const { fxdPrice } = usePricesContext();
  const { isMobile } = useSharedContext();
  const vaultTestId = vaultItemData.id;

  return (
    <Grid container>
      <Grid item>
        <VaultTitle>
          {vaultTitle[vaultItemData.id.toLowerCase()]
            ? vaultTitle[vaultItemData.id.toLowerCase()]
            : token.name}
        </VaultTitle>
        <VaultInfo>
          <Pooled>
            Pooled {token.name}:
            <Token
              data-testid={`vaultRowDetails-${vaultTestId}-itemPositionInfo-earningDetails-pooledValue`}
            >
              <img
                src={getTokenLogoURL(token.symbol)}
                width={20}
                height={20}
                alt={"token img"}
              />
              {formatPercentage(
                BigNumber(balancePosition)
                  .dividedBy(10 ** 18)
                  .toNumber()
              )}
            </Token>
          </Pooled>
          <PoolShare>
            Your share:{" "}
            <span
              data-testid={`vaultRowDetails-${vaultTestId}-itemPositionInfo-earningDetails-yourShareValue`}
            >
              {`${formatPercentage(
                BigNumber(balanceShares)
                  .dividedBy(sharesSupply)
                  .multipliedBy(100)
                  .toNumber()
              )}%`}
            </span>
          </PoolShare>
          <TotalTokens>
            Share token:{" "}
            <span
              data-testid={`vaultRowDetails-${vaultTestId}-itemPositionInfo-earningDetails-shareTokenValue`}
            >
              {formatPercentage(
                BigNumber(balanceShares)
                  .dividedBy(10 ** 18)
                  .toNumber()
              )}{" "}
              {shareToken.name}
            </span>
          </TotalTokens>
        </VaultInfo>
        {isMobile && (
          <Apr>
            Apy
            <span
              data-testid={`vaultRowDetails-${vaultTestId}-itemPositionInfo-earningDetails-aprValue`}
            >
              {formattedApr}%
            </span>
          </Apr>
        )}
        <VaultInfoStats>
          {!isMobile && (
            <Apr>
              Apy
              <span>{formattedApr}%</span>
            </Apr>
          )}
          <Approx>
            ~
            {formatNumber(
              BigNumber(balancePosition)
                .multipliedBy(aprNumber)
                .dividedBy(100)
                .dividedBy(10 ** 36)
                .multipliedBy(fxdPrice)
                .toNumber()
            )}{" "}
            USD
          </Approx>
        </VaultInfoStats>
      </Grid>
    </Grid>
  );
};

export default memo(VaultListItemEarningDetails);
