import { Box, Button } from "@mui/material";
import { StableAPYTooltip } from "apps/lending/components/infoTooltips/StableAPYTooltip";
import { VariableAPYTooltip } from "apps/lending/components/infoTooltips/VariableAPYTooltip";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { DashboardReserve } from "apps/lending/utils/dashboardSortUtils";

import { CapsHint } from "apps/lending/components/caps/CapsHint";
import { CapType } from "apps/lending/components/caps/helper";
import { IncentivesCard } from "apps/lending/components/incentives/IncentivesCard";
import { Link, ROUTES } from "apps/lending/components/primitives/Link";
import { Row } from "apps/lending/components/primitives/Row";
import { useModalContext } from "apps/lending/hooks/useModal";
import { ListMobileItemWrapper } from "apps/lending/modules/dashboard/lists/ListMobileItemWrapper";
import { ListValueRow } from "apps/lending/modules/dashboard/lists/ListValueRow";
import { FC, memo } from "react";
import { isFeatureEnabled } from "apps/lending/utils/marketsAndNetworksConfig";

export const BorrowAssetsListMobileItem: FC<DashboardReserve> = memo(
  ({
    symbol,
    iconSymbol,
    name,
    availableBorrows,
    availableBorrowsInUSD,
    borrowCap,
    totalBorrows,
    variableBorrowRate,
    stableBorrowRate,
    sIncentivesData,
    vIncentivesData,
    underlyingAsset,
    isFreezed,
  }) => {
    const { openBorrow } = useModalContext();
    const { currentMarket, currentMarketData } = useProtocolDataContext();

    const disableBorrow = isFreezed || Number(availableBorrows) <= 0;

    return (
      <ListMobileItemWrapper
        symbol={symbol}
        iconSymbol={iconSymbol}
        name={name}
        underlyingAsset={underlyingAsset}
        currentMarket={currentMarket}
      >
        <ListValueRow
          title={"Available to borrow"}
          value={Number(availableBorrows)}
          subValue={Number(availableBorrowsInUSD)}
          disabled={Number(availableBorrows) === 0}
          capsComponent={
            <CapsHint
              capType={CapType.borrowCap}
              capAmount={borrowCap}
              totalAmount={totalBorrows}
              withoutText
            />
          }
        />

        <Row
          caption={
            <VariableAPYTooltip
              text={"APY, variable"}
              key="APY_dash_mob_variable_ type"
              variant="description"
            />
          }
          align="flex-start"
          captionVariant="description"
          captionColor={"primary.light"}
          mb={1}
        >
          <IncentivesCard
            value={Number(variableBorrowRate)}
            incentives={vIncentivesData}
            symbol={symbol}
            variant="secondary14"
            color={"primary.light"}
          />
        </Row>

        {isFeatureEnabled.stableBorrowRate(currentMarketData) ? (
          <Row
            caption={
              <StableAPYTooltip
                text={"APY, stable"}
                key="APY_dash_mob_stable_ type"
                variant="description"
              />
            }
            align="flex-start"
            captionVariant="description"
            captionColor={"primary.light"}
            mb={1}
          >
            <IncentivesCard
              value={Number(stableBorrowRate)}
              incentives={sIncentivesData}
              symbol={symbol}
              variant="secondary14"
              color={"primary.light"}
            />
          </Row>
        ) : null}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 2.5,
          }}
        >
          <Button
            disabled={disableBorrow}
            variant="gradient"
            onClick={() =>
              openBorrow(underlyingAsset, currentMarket, name, "dashboard")
            }
            sx={{ mr: 0.75 }}
            fullWidth
          >
            Borrow
          </Button>
          <Button
            variant="outlined"
            component={Link}
            href={ROUTES.reserveOverview(underlyingAsset, currentMarket)}
            fullWidth
          >
            Details
          </Button>
        </Box>
      </ListMobileItemWrapper>
    );
  }
);
