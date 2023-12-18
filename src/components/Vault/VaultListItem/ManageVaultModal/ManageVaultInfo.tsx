import { FC } from "react";
import BigNumber from "bignumber.js";
import { Box, Divider, Grid, ListItemText } from "@mui/material";
import { IVault, IVaultPosition } from "fathom-sdk";
import { FormType } from "hooks/useVaultManageDeposit";
import { AppList, AppListItem } from "components/AppComponents/AppList/AppList";
import { formatNumber, formatPercentage } from "utils/format";

type VaultManageInfoProps = {
  vaultItemData: IVault;
  vaultPosition: IVaultPosition;
  formToken: string;
  formSharedToken: string;
  formType: FormType;
};

const ManageVaultInfo: FC<VaultManageInfoProps> = ({
  formType,
  vaultItemData,
  vaultPosition,
  formToken,
  formSharedToken,
}) => {
  const { token, shareToken, balanceTokens, strategies } = vaultItemData;
  const { balancePosition, balanceShares } = vaultPosition;

  const { totalApr, count } = strategies[0].reports.reduce(
    (accumulator: any, strategyReport: any) => {
      strategyReport.results.forEach((result: any) => {
        if (result.apr) {
          accumulator.totalApr += parseFloat(result.apr);
          accumulator.count++;
        }
      });
      return accumulator;
    },
    { totalApr: 0, count: 0 }
  );

  const averageApr = count > 0 ? totalApr / count : 0;

  return (
    <Grid item xs={12} sm={6} pr={2.5}>
      <AppList>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              {formatPercentage(
                BigNumber(balancePosition)
                  .dividedBy(10 ** 18)
                  .toNumber()
              ) +
                " " +
                token.name +
                " "}
              <Box
                component="span"
                sx={{
                  color: formType === FormType.DEPOSIT ? "#29C20A" : "#F76E6E",
                }}
              >
                →{" "}
                {formType === FormType.DEPOSIT
                  ? formatPercentage(
                      BigNumber(balancePosition)
                        .dividedBy(10 ** 18)
                        .plus(BigNumber(formToken || "0"))
                        .toNumber()
                    ) +
                    " " +
                    token.name +
                    " "
                  : formatPercentage(
                      BigNumber(balancePosition)
                        .dividedBy(10 ** 18)
                        .minus(BigNumber(formToken || "0"))
                        .toNumber()
                    ) +
                    " " +
                    token.name +
                    " "}
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
              {`${formatNumber(
                BigNumber(balancePosition)
                  .dividedBy(BigNumber(balanceTokens))
                  .multipliedBy(100)
                  .toNumber()
              )} %`}
              <Box
                component="span"
                sx={{
                  color: formType === FormType.DEPOSIT ? "#29C20A" : "#F76E6E",
                }}
              >
                →{" "}
                {formType === FormType.DEPOSIT
                  ? formatNumber(
                      BigNumber(balancePosition)
                        .plus(
                          BigNumber(formToken || "0").multipliedBy(10 ** 18)
                        )
                        .dividedBy(
                          BigNumber(balanceTokens).plus(
                            BigNumber(formToken || "0").multipliedBy(10 ** 18)
                          )
                        )
                        .multipliedBy(100)
                        .toNumber()
                    )
                  : BigNumber(formToken)
                      .multipliedBy(10 ** 18)
                      .isEqualTo(BigNumber(balanceTokens))
                  ? "0"
                  : formatNumber(
                      BigNumber(balancePosition)
                        .minus(
                          BigNumber(formToken || "0").multipliedBy(10 ** 18)
                        )
                        .dividedBy(
                          BigNumber(balanceTokens).minus(
                            BigNumber(formToken || "0").multipliedBy(10 ** 18)
                          )
                        )
                        .multipliedBy(100)
                        .toNumber()
                    )}{" "}
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
              {formatPercentage(
                BigNumber(balanceShares)
                  .dividedBy(10 ** 18)
                  .toNumber()
              ) +
                " " +
                shareToken.symbol +
                " "}
              <Box
                component="span"
                sx={{
                  color: formType === FormType.DEPOSIT ? "#29C20A" : "#F76E6E",
                }}
              >
                →{" "}
                {formType === FormType.DEPOSIT
                  ? formatPercentage(
                      BigNumber(balanceShares)
                        .dividedBy(10 ** 18)
                        .plus(BigNumber(formSharedToken || "0"))
                        .toNumber()
                    ) +
                    " " +
                    shareToken.symbol
                  : formatPercentage(
                      BigNumber(balanceShares)
                        .dividedBy(10 ** 18)
                        .minus(BigNumber(formSharedToken || "0"))
                        .toNumber()
                    ) +
                    " " +
                    shareToken.symbol}{" "}
              </Box>
            </>
          }
        >
          <ListItemText primary="Share tokens" />
        </AppListItem>
        <Divider />
        <AppListItem
          alignItems="flex-start"
          secondaryAction={strategies[0].reports[0].totalFees + "%"}
        >
          <ListItemText primary="Fee" />
        </AppListItem>
        <Divider />
        <AppListItem
          alignItems="flex-start"
          secondaryAction={
            formatNumber(
              BigNumber(strategies[0].reports[0].results[0].apr).toNumber()
            ) + "%"
          }
        >
          <ListItemText primary="Estimated APR" />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={formatNumber(BigNumber(averageApr).toNumber()) + "%"}
        >
          <ListItemText primary="Historical APR" />
        </AppListItem>
      </AppList>
    </Grid>
  );
};

export default ManageVaultInfo;
