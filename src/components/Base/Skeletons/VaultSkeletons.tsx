import { Box, ListItemText } from "@mui/material";
import { VaultAboutTitle } from "utils/Vaults/getVaultTitleAndDescription";
import {
  StrategySelector,
  StrategySelectorLabel,
} from "components/Vaults/VaultDetail/VaultDetailInfoTabStrategies";
import {
  AppListApy,
  AppListFees,
  VaultContractAddress,
  VaultDescriptionWrapper,
} from "components/Vaults/VaultDetail/VaultDetailInfoTabAbout";
import {
  VaultIndicatorItemLabel,
  VaultIndicatorItemWrapper,
  VaultIndicatorsWrapper,
  VaultStrategyDescription,
  VaultStrategyTitle,
} from "components/Vaults/VaultDetail/VaultStrategyItem";
import { CustomSkeleton } from "components/Base/Skeletons/StyledSkeleton";
import { BaseListItem } from "components/Base/List/StyledList";

export const VaultAboutSkeleton = () => {
  return (
    <>
      <VaultDescriptionWrapper>
        <VaultAboutTitle variant={"h5"}>Description</VaultAboutTitle>
        <CustomSkeleton
          variant={"text"}
          animation={"wave"}
          width={"100%"}
          height={100}
        />
      </VaultDescriptionWrapper>
      <VaultContractAddress
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 1,
        }}
      >
        Vault contract address:{" "}
        <CustomSkeleton
          variant={"text"}
          animation={"wave"}
          height={17}
          width={350}
        />
      </VaultContractAddress>
      <Box>
        <VaultAboutTitle variant={"h5"} sx={{ marginBottom: 0 }}>
          APY
        </VaultAboutTitle>
        <Box width={"100%"}>
          <AppListApy>
            <BaseListItem
              alignItems="flex-start"
              secondaryAction={
                <CustomSkeleton
                  variant={"text"}
                  animation={"wave"}
                  width={50}
                />
              }
              sx={{ padding: "0 !important" }}
            >
              <ListItemText primary={"Weekly APY"} />
            </BaseListItem>
            <BaseListItem
              alignItems="flex-start"
              secondaryAction={
                <CustomSkeleton
                  variant={"text"}
                  animation={"wave"}
                  width={50}
                />
              }
              sx={{ padding: "0 !important" }}
            >
              <ListItemText primary={"Monthly APY"} />
            </BaseListItem>
            <BaseListItem
              alignItems="flex-start"
              secondaryAction={
                <CustomSkeleton
                  variant={"text"}
                  animation={"wave"}
                  width={50}
                />
              }
              sx={{ padding: "0 !important" }}
            >
              <ListItemText primary={"Yearly APY"} />
            </BaseListItem>
          </AppListApy>
        </Box>
      </Box>
      <Box>
        <VaultAboutTitle sx={{ marginBottom: 0 }}>Fees</VaultAboutTitle>
        <AppListFees>
          <BaseListItem
            alignItems="flex-start"
            secondaryAction={
              <CustomSkeleton variant={"text"} animation={"wave"} width={50} />
            }
            sx={{ padding: "0 !important" }}
          >
            <ListItemText primary={"Protocol fee"} />
          </BaseListItem>
          <BaseListItem
            alignItems="flex-start"
            secondaryAction={
              <CustomSkeleton variant={"text"} animation={"wave"} width={50} />
            }
            sx={{ padding: "0 !important" }}
          >
            <ListItemText primary={"Total fee"} />
          </BaseListItem>
        </AppListFees>
      </Box>
    </>
  );
};

export const VaultStrategiesSkeleton = () => {
  return (
    <>
      <Box>
        <StrategySelectorLabel>Strategy</StrategySelectorLabel>
        <StrategySelector>
          <CustomSkeleton
            variant={"rounded"}
            animation={"wave"}
            width={200}
            height={46}
          />
          <CustomSkeleton
            variant={"rounded"}
            animation={"wave"}
            width={200}
            height={46}
          />
        </StrategySelector>
      </Box>
      <Box>
        <VaultStrategyTitle>
          <CustomSkeleton
            variant={"rounded"}
            animation={"wave"}
            height={22}
            width={150}
          />
        </VaultStrategyTitle>
        <CustomSkeleton
          variant={"rounded"}
          animation={"wave"}
          height={20}
          width={250}
          sx={{ marginBottom: "16px" }}
        />
        <VaultStrategyDescription>
          <CustomSkeleton
            variant={"rounded"}
            animation={"wave"}
            height={150}
            width={"100%"}
          />
        </VaultStrategyDescription>
        <VaultIndicatorsWrapper>
          <VaultIndicatorItemWrapper>
            <VaultIndicatorItemLabel>
              Capital Allocation
            </VaultIndicatorItemLabel>
            <CustomSkeleton
              variant={"rounded"}
              animation={"wave"}
              height={22}
              width={100}
            />
          </VaultIndicatorItemWrapper>
          <VaultIndicatorItemWrapper>
            <VaultIndicatorItemLabel>Total Gain</VaultIndicatorItemLabel>
            <CustomSkeleton
              variant={"rounded"}
              animation={"wave"}
              height={22}
              width={100}
            />
          </VaultIndicatorItemWrapper>
          <VaultIndicatorItemWrapper>
            <VaultIndicatorItemLabel>APY</VaultIndicatorItemLabel>
            <CustomSkeleton
              variant={"rounded"}
              animation={"wave"}
              height={22}
              width={100}
            />
          </VaultIndicatorItemWrapper>
          <VaultIndicatorItemWrapper>
            <VaultIndicatorItemLabel>Allocation</VaultIndicatorItemLabel>
            <CustomSkeleton
              variant={"rounded"}
              animation={"wave"}
              height={22}
              width={100}
            />
          </VaultIndicatorItemWrapper>
          <VaultIndicatorItemWrapper>
            <VaultIndicatorItemLabel>Perfomance fee</VaultIndicatorItemLabel>
            <CustomSkeleton
              variant={"rounded"}
              animation={"wave"}
              height={22}
              width={100}
            />
          </VaultIndicatorItemWrapper>
        </VaultIndicatorsWrapper>
      </Box>
    </>
  );
};
