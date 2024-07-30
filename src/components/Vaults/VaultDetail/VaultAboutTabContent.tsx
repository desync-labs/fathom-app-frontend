import { Link } from "react-router-dom";
import BigNumber from "bignumber.js";
import { Box, ListItemText, styled, Typography } from "@mui/material";
import {
  VaultAboutTitle,
  vaultDescription,
} from "utils/Vaults/getVaultTitleAndDescription";
import { getAccountUrl } from "utils/explorer";
import { DEFAULT_CHAIN_ID } from "utils/Constants";
import useVaultContext from "context/vault";
import { useAprNumber } from "hooks/Vaults/useApr";
import { formatNumber, formatPercentage } from "utils/format";
import { AppListItem } from "components/AppComponents/AppList/AppList";
import {
  AppListApy,
  AppListFees,
  VaultContractAddress,
  VaultDescriptionWrapper,
} from "components/Vaults/VaultDetail/VaultDetailInfoTabAbout";
import BasePopover from "components/Base/Popover/BasePopover";
import { getDefaultVaultDescription } from "utils/Vaults/getVaultTitleAndDescription";

const FeesItemWrapper = styled(Box)`
  display: flex;
  gap: 4px;
`;

const VaultAboutTabContent = () => {
  const { vault, performanceFee, protocolFee } = useVaultContext();
  const aprNumber = useAprNumber(vault);
  return (
    <>
      <VaultDescriptionWrapper>
        {vaultDescription[vault.id.toLowerCase()] ? (
          vaultDescription[vault.id.toLowerCase()]
        ) : (
          <>
            <VaultAboutTitle variant={"h5"}>Description</VaultAboutTitle>
            <Typography component={"span"}>
              {getDefaultVaultDescription(vault.type)}
            </Typography>
          </>
        )}
      </VaultDescriptionWrapper>
      <VaultContractAddress>
        Vault contract address:{" "}
        <Link to={getAccountUrl(vault.id, DEFAULT_CHAIN_ID)} target="_blank">
          {vault.id}
        </Link>
      </VaultContractAddress>
      <Box>
        <VaultAboutTitle variant={"h5"} sx={{ marginBottom: 0 }}>
          APY
        </VaultAboutTitle>
        <Box width={"100%"}>
          <AppListApy>
            <AppListItem
              alignItems="flex-start"
              secondaryAction={
                <>
                  {formatNumber(BigNumber(aprNumber).dividedBy(52).toNumber())}%
                </>
              }
              sx={{ padding: "0 !important" }}
            >
              <ListItemText primary={"Weekly APY"} />
            </AppListItem>
            <AppListItem
              alignItems="flex-start"
              secondaryAction={
                <>
                  {formatNumber(BigNumber(aprNumber).dividedBy(12).toNumber())}%
                </>
              }
              sx={{ padding: "0 !important" }}
            >
              <ListItemText primary={"Monthly APY"} />
            </AppListItem>
            <AppListItem
              alignItems="flex-start"
              secondaryAction={<>{formatNumber(aprNumber)}%</>}
              sx={{ padding: "0 !important" }}
            >
              <ListItemText primary={"Yearly APY"} />
            </AppListItem>
          </AppListApy>
        </Box>
      </Box>
      <Box>
        <VaultAboutTitle sx={{ marginBottom: 0 }}>Fees</VaultAboutTitle>
        <AppListFees>
          <AppListItem
            alignItems="flex-start"
            secondaryAction={
              <>
                {`${formatPercentage(
                  Number(performanceFee * (protocolFee / 100))
                )}%`}
              </>
            }
            sx={{ padding: "0 !important" }}
          >
            <ListItemText
              primary={
                <FeesItemWrapper>
                  Protocol fee
                  <BasePopover
                    id={"protocol-fee"}
                    text={
                      "Taken from the performance fee as a percentage of it."
                    }
                    iconSize={"15px"}
                  />
                </FeesItemWrapper>
              }
            />
          </AppListItem>
          <AppListItem
            alignItems="flex-start"
            secondaryAction={
              <>{`${formatPercentage(Number(performanceFee))}%`}</>
            }
            sx={{ padding: "0 !important" }}
          >
            <ListItemText
              primary={
                <FeesItemWrapper>
                  Total fee
                  <BasePopover
                    id={"total-fee"}
                    text={
                      "The fee is charged from the gain (performance fee) and shared between the manager and protocol."
                    }
                    iconSize={"15px"}
                  />
                </FeesItemWrapper>
              }
            />
          </AppListItem>
        </AppListFees>
      </Box>
    </>
  );
};

export default VaultAboutTabContent;
