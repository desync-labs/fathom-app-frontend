import { Box, ListItemText, Skeleton, styled } from "@mui/material";
import { FC } from "react";
import { VaultAboutTitle } from "utils/getVaultTitleAndDescription";
import {
  AppListApy,
  AppListFees,
  VaultContractAddress,
  VaultDescriptionWrapper,
} from "components/Vaults/VaultDetail/VaultDetailInfoTabAbout";
import { AppListItem } from "components/AppComponents/AppList/AppList";
import {
  VaultIndicatorItemLabel,
  VaultIndicatorItemWrapper,
  VaultIndicatorsWrapper,
  VaultStrategyDescription,
  VaultStrategyTitle,
} from "components/Vaults/VaultDetail/VaultStrategyItem";
import {
  StrategySelector,
  StrategySelectorLabel,
} from "components/Vaults/VaultDetail/VaultDetailInfoTabStrategies";

export const CustomSkeleton = styled(Skeleton)`
  background-color: #2536564a;
`;

type StatsValueSkeletonProps = {
  width?: number | string;
  height?: number | string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  animation?: "pulse" | "wave" | false;
  isMobile?: boolean;
};

export const StatsValueSkeleton: FC<StatsValueSkeletonProps> = ({
  width = 200,
  height = 28,
  variant = "rounded",
  animation = "wave",
  isMobile = false,
}) => {
  return (
    <Skeleton
      variant={variant}
      animation={animation}
      width={width}
      height={height}
      sx={{ bgcolor: "#2536564a", marginTop: isMobile ? "0" : "12px" }}
    />
  );
};
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
            <AppListItem
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
            </AppListItem>
            <AppListItem
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
            </AppListItem>
            <AppListItem
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
              <CustomSkeleton variant={"text"} animation={"wave"} width={50} />
            }
            sx={{ padding: "0 !important" }}
          >
            <ListItemText primary={"Protocol fee"} />
          </AppListItem>
          <AppListItem
            alignItems="flex-start"
            secondaryAction={
              <CustomSkeleton variant={"text"} animation={"wave"} width={50} />
            }
            sx={{ padding: "0 !important" }}
          >
            <ListItemText primary={"Total fee"} />
          </AppListItem>
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

export const AppSkeletonValue = styled(Skeleton)`
  background-color: #8ea4cc26;
`;
