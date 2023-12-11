import { FC } from "react";
import BigNumber from "bignumber.js";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { IVault } from "fathom-sdk";
import { getTokenLogoURL } from "utils/tokenLogo";
import {
  Approx,
  Apr,
  VaultInfoStats,
  Token,
} from "components/Vault/VaultListItem/VaultListItemVaultInfo";
import { ButtonSecondary } from "components/AppComponents/AppButton/AppButton";
import usePricesContext from "context/prices";
import { formatNumber } from "utils/format";

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

type VaultListItemFarmingDetailsProps = {
  isMobile: boolean;
  vaultItemData: IVault;
  vaultPosition?: any;
  onOpen: () => void;
};

const VaultListItemEarningDetails: FC<VaultListItemFarmingDetailsProps> = ({
  isMobile,
  onOpen,
  vaultItemData,
  vaultPosition,
}) => {
  const { token, shareToken, balanceTokens, strategies } = vaultItemData;
  const { balancePosition, balanceShares } = vaultPosition;
  const { fxdPrice } = usePricesContext();

  return (
    <Grid container>
      <Grid item xs={isMobile ? 12 : 10}>
        <VaultTitle>{token.name}</VaultTitle>
        <VaultInfo>
          <Pooled>
            Pooled {token.name}:
            <Token>
              <img
                src={getTokenLogoURL(token.symbol)}
                width={20}
                height={20}
                alt={"token img"}
              />
              {BigNumber(balancePosition)
                .dividedBy(10 ** 18)
                .toFormat(0)}
            </Token>
          </Pooled>
          <PoolShare>
            Your share:{" "}
            <span>
              {`${BigNumber(balancePosition)
                .dividedBy(BigNumber(balanceTokens))
                .times(100)
                .toFormat(2)}%`}
            </span>
          </PoolShare>
          <TotalTokens>
            Share token:{" "}
            <span>
              {BigNumber(balanceShares)
                .dividedBy(10 ** 18)
                .toFormat(2)}
            </span>{" "}
            {shareToken.name}
          </TotalTokens>
        </VaultInfo>
        {isMobile && (
          <Apr>
            Apr
            <span>
              {formatNumber(
                BigNumber(strategies[0].reports[0].results[0].apr).toNumber()
              )}
              %
            </span>
          </Apr>
        )}
        <VaultInfoStats>
          {!isMobile && (
            <Apr>
              Apr
              <span>
                {formatNumber(
                  BigNumber(strategies[0].reports[0].results[0].apr).toNumber()
                )}
                %
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
