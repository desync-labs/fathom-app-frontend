import { FC, memo } from "react";
import BigNumber from "bignumber.js";
import { Box, Divider, Grid, ListItemText } from "@mui/material";
import { IVault } from "fathom-sdk";
import { AppList, AppListItem } from "components/AppComponents/AppList/AppList";
import { formatNumber, formatPercentage } from "utils/format";
import useSharedContext from "context/shared";

type VaultDepositInfoProps = {
  vaultItemData: IVault;
  deposit: string;
  sharedToken: string;
  performanceFee: number;
};

const DepositVaultInfo: FC<VaultDepositInfoProps> = ({
  vaultItemData,
  deposit,
  sharedToken,
  performanceFee,
}) => {
  const { token, shareToken, apr, sharesSupply } = vaultItemData;
  const { isMobile } = useSharedContext();

  return (
    <Grid item xs={12} sm={6} pr={isMobile ? 0 : 2.5}>
      <AppList>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              0 {token.name + " "}
              <Box component="span" sx={{ color: "#29C20A" }}>
                → {formatPercentage(Number(deposit || "0")) + " " + token.name}
              </Box>
            </>
          }
        >
          <ListItemText primary={token.name + " Deposited"} />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              0 %{" "}
              <Box component="span" sx={{ color: "#29C20A" }}>
                →{" "}
                {BigNumber(sharedToken).isGreaterThan(0) ||
                BigNumber(sharesSupply).isGreaterThan(0)
                  ? formatNumber(
                      BigNumber(sharedToken || "0")
                        .multipliedBy(10 ** 18)
                        .dividedBy(
                          BigNumber(sharesSupply).plus(
                            BigNumber(sharedToken || "0").multipliedBy(10 ** 18)
                          )
                        )
                        .times(100)
                        .toNumber()
                    )
                  : "0"}{" "}
                %
              </Box>
            </>
          }
        >
          <ListItemText primary="Pool share" />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              {`0 ${shareToken.symbol} `}
              <Box component="span" sx={{ color: "#29C20A" }}>
                →{" "}
                {formatPercentage(Number(sharedToken || "0")) +
                  " " +
                  shareToken.symbol}
              </Box>
            </>
          }
        >
          <ListItemText primary="Share tokens" />
        </AppListItem>
        <Divider />
        <AppListItem
          alignItems="flex-start"
          secondaryAction={formatPercentage(Number(performanceFee)) + "%"}
        >
          <ListItemText primary="Fee" />
        </AppListItem>
        <Divider />
        <AppListItem
          alignItems="flex-start"
          secondaryAction={formatNumber(Number(apr)) + "%"}
        >
          <ListItemText primary="Estimated APR" />
        </AppListItem>
      </AppList>
    </Grid>
  );
};

export default memo(DepositVaultInfo);
