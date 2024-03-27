import { FC, memo } from "react";
import BigNumber from "bignumber.js";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { IVault } from "fathom-sdk";
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
  balanceEarned: number;
};

const VaultListItemEarned: FC<FarmListItemEarnedProps> = ({
  vaultItemData,
  balanceEarned,
}) => {
  const { token } = vaultItemData;
  const { fxdPrice } = usePricesContext();
  const { isMobile } = useSharedContext();

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
                It is only updated when the user withdraw all the shares.
              </>
            }
          />
        </TokenName>
        <TokenValue>
          {BigNumber(balanceEarned).isGreaterThan(0)
            ? formatPercentage(balanceEarned)
            : "0"}{" "}
          <span>
            $
            {BigNumber(balanceEarned).isGreaterThan(0)
              ? formatPercentage(
                  BigNumber(balanceEarned || "0")
                    .multipliedBy(fxdPrice)
                    .dividedBy(10 ** 18)
                    .toNumber()
                )
              : "0"}
          </span>
        </TokenValue>
      </Grid>
    </Grid>
  );
};

export default memo(VaultListItemEarned);
