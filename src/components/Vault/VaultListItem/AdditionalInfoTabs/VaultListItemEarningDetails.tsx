import { FC } from "react";
import BigNumber from "bignumber.js";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { IVault } from "fathom-sdk";
import { getTokenLogoURL } from "utils/tokenLogo";
import { ButtonSecondary } from "components/AppComponents/AppButton/AppButton";
import usePricesContext from "context/prices";
import useSharedContext from "context/shared";
import { formatNumber, formatPercentage } from "utils/format";

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

const ManageVaultBtnWrapper = styled("div")`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-top: 40px;
    height: auto;
  }
`;

const ManageVaultBtn = styled(ButtonSecondary)`
  width: 100%;
  height: 40px;
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
  onOpen: () => void;
};

const VaultListItemEarningDetails: FC<VaultListItemFarmingDetailsProps> = ({
  onOpen,
  vaultItemData,
  vaultPosition,
}) => {
  const { token, shareToken, balanceTokens, strategies } = vaultItemData;
  const { balancePosition, balanceShares } = vaultPosition;
  const { fxdPrice } = usePricesContext();
  const { isMobile } = useSharedContext();
  const vaultTestId = vaultPosition.token.name.split(" ").join("-");

  return (
    <Grid container>
      <Grid item xs={isMobile ? 12 : 10}>
        <VaultTitle>{token.name}</VaultTitle>
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
                BigNumber(balancePosition)
                  .dividedBy(balanceTokens)
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
            Apr
            <span
              data-testid={`vaultRowDetails-${vaultTestId}-itemPositionInfo-earningDetails-aprValue`}
            >
              {formatNumber(Number(strategies[0].reports[0].results[0].apr))}%
            </span>
          </Apr>
        )}
        <VaultInfoStats>
          {!isMobile && (
            <Apr>
              Apr
              <span>
                {formatNumber(Number(strategies[0].reports[0].results[0].apr))}%
              </span>
            </Apr>
          )}
          <Approx>
            ~
            {formatNumber(
              BigNumber(balancePosition)
                .multipliedBy(strategies[0].reports[0].results[0].apr)
                .dividedBy(100)
                .dividedBy(10 ** 36)
                .multipliedBy(fxdPrice)
                .toNumber()
            )}{" "}
            USD
          </Approx>
        </VaultInfoStats>
      </Grid>
      <Grid item xs={isMobile ? 12 : 2}>
        <ManageVaultBtnWrapper>
          <ManageVaultBtn onClick={onOpen}>Manage Vault</ManageVaultBtn>
        </ManageVaultBtnWrapper>
      </Grid>
    </Grid>
  );
};

export default VaultListItemEarningDetails;
