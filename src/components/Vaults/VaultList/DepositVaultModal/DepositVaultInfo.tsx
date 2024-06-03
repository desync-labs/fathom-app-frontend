import { FC, memo } from "react";
import BigNumber from "bignumber.js";
import { Box, Divider, ListItemText, styled } from "@mui/material";
import { IVault } from "fathom-sdk";
import { formatNumber, formatPercentage } from "utils/format";
import { useApr } from "hooks/useApr";
import {
  AppListItem,
  AppListVault,
} from "components/AppComponents/AppList/AppList";
import { Summary } from "components/AppComponents/AppBox/AppBox";

const DepositVaultFormInfoWrapper = styled(Box)`
  position: relative;
  width: 100%;
  border-radius: 12px;
  background: #1e2f4c;
  padding: 24px;
  margin-top: 20px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 0;
  }
`;

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
  const { token, shareToken, sharesSupply } = vaultItemData;
  const formattedApr = useApr(vaultItemData);

  return (
    <DepositVaultFormInfoWrapper>
      <Summary>Summary</Summary>
      <Divider />
      <AppListVault>
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
          <ListItemText primary="Estimated APR" />
        </AppListItem>
      </AppListVault>
    </DepositVaultFormInfoWrapper>
  );
};

export default memo(DepositVaultInfo);
