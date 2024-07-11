import { FC, memo } from "react";
import BigNumber from "bignumber.js";
import { Box, Divider, ListItemText } from "@mui/material";
import { IVault, IVaultPosition } from "fathom-sdk";

import { FormType } from "hooks/Vaults/useVaultManageDeposit";
import { formatNumber, formatPercentage } from "utils/format";
import { useApr } from "hooks/Vaults/useApr";
import { AppListItem } from "components/AppComponents/AppList/AppList";
import { Summary } from "components/AppComponents/AppBox/AppBox";
import {
  BaseDialogFormInfoWrapper,
  BaseFormInfoList,
} from "components/Base/Form/StyledForm";

type VaultManageInfoProps = {
  vaultItemData: IVault;
  vaultPosition: IVaultPosition;
  formToken: string;
  formSharedToken: string;
  formType: FormType;
  performanceFee: number;
};

const ManageVaultInfo: FC<VaultManageInfoProps> = ({
  formType,
  vaultItemData,
  vaultPosition,
  formToken,
  formSharedToken,
  performanceFee,
}) => {
  const { token, shareToken, sharesSupply } = vaultItemData;
  const { balancePosition, balanceShares } = vaultPosition;
  const formattedApr = useApr(vaultItemData);

  return (
    <BaseDialogFormInfoWrapper>
      <Summary>Summary</Summary>
      <Divider />
      <BaseFormInfoList>
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
                      Math.max(
                        BigNumber(balancePosition)
                          .dividedBy(10 ** 18)
                          .minus(BigNumber(formToken || "0"))
                          .toNumber(),
                        0
                      )
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
                BigNumber(balanceShares)
                  .dividedBy(BigNumber(sharesSupply))
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
                      BigNumber(balanceShares)
                        .plus(
                          BigNumber(formSharedToken || "0").multipliedBy(
                            10 ** 18
                          )
                        )
                        .dividedBy(
                          BigNumber(sharesSupply).plus(
                            BigNumber(formSharedToken || "0").multipliedBy(
                              10 ** 18
                            )
                          )
                        )
                        .multipliedBy(100)
                        .toNumber()
                    )
                  : BigNumber(formSharedToken)
                      .multipliedBy(10 ** 18)
                      .isEqualTo(BigNumber(sharesSupply))
                  ? "0"
                  : formatNumber(
                      Math.max(
                        BigNumber(balanceShares)
                          .minus(
                            BigNumber(formSharedToken || "0").multipliedBy(
                              10 ** 18
                            )
                          )
                          .dividedBy(
                            BigNumber(sharesSupply).minus(
                              BigNumber(formSharedToken || "0").multipliedBy(
                                10 ** 18
                              )
                            )
                          )
                          .multipliedBy(100)
                          .toNumber(),
                        0
                      )
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
                      Math.max(
                        BigNumber(balanceShares)
                          .dividedBy(10 ** 18)
                          .minus(BigNumber(formSharedToken || "0"))
                          .toNumber(),
                        0
                      )
                    ) +
                    " " +
                    shareToken.symbol}{" "}
              </Box>
            </>
          }
        >
          <ListItemText primary="Share tokens" />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={formatPercentage(Number(performanceFee)) + "%"}
        >
          <ListItemText primary="Total Fee" />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={formattedApr + "%"}
        >
          <ListItemText primary="Estimated APY" />
        </AppListItem>
      </BaseFormInfoList>
    </BaseDialogFormInfoWrapper>
  );
};

export default memo(ManageVaultInfo);
