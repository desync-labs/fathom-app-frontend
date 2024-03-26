import { FC, memo } from "react";
import BigNumber from "bignumber.js";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { IVault, IVaultPosition } from "fathom-sdk";
import AppPopover from "components/AppComponents/AppPopover/AppPopover";
import usePricesContext from "context/prices";
import useSharedContext from "context/shared";
import { formatPercentage } from "utils/format";

const TokenName = styled("div")`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;

  span {
    font-weight: normal;
    color: #8ea4cc;
    font-size: 14px;
    line-height: 20px;
  }
`;

const TokenValue = styled("div")`
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 7px;
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  line-height: 28px;

  span {
    font-weight: normal;
    color: #8ea4cc;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.14px;
  }
`;

type FarmListItemEarnedProps = {
  vaultItemData: IVault;
  vaultPosition: IVaultPosition;
  balanceToken: string;
};

const VaultListItemEarned: FC<FarmListItemEarnedProps> = ({
  vaultItemData,
  vaultPosition,
  balanceToken,
}) => {
  const { token } = vaultItemData;
  const { balancePosition } = vaultPosition;
  const { fxdPrice } = usePricesContext();
  const { isMobile } = useSharedContext();

  console.log({
    balanceToken,
    vaultPosition,
  });

  return (
    <Grid container>
      <Grid item xs={isMobile ? 12 : 3}>
        <TokenName>
          {token.name} <span>Earned</span>
          <AppPopover
            id={"earned"}
            text={
              <>
                The accumulated profit for the account/vault.
                <br />
                It is only updated when the user withdraws all the shares.
              </>
            }
          />
        </TokenName>
        <TokenValue>
          {formatPercentage(
            BigNumber(balanceToken || "0")
              .minus(balancePosition)
              .dividedBy(10 ** 18)
              .toNumber()
          )}{" "}
          <span>
            $
            {formatPercentage(
              BigNumber(balanceToken || "0")
                .minus(balancePosition)
                .multipliedBy(fxdPrice)
                .dividedBy(10 ** 36)
                .toNumber()
            )}
          </span>
        </TokenValue>
      </Grid>
    </Grid>
  );
};

export default memo(VaultListItemEarned);
