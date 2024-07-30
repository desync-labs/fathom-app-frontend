import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import useProtocolStats from "hooks/General/useProtocolStats";
import { formatCurrency, formatNumber } from "utils/format";
import usePricesContext from "context/prices";
import useSharedContext from "context/shared";
import BasePageStatsWrapper from "components/Base/PageStatsGrid/PageStatsWrapper";
import BasePageStatsItem from "components/Base/PageStatsGrid/PageStatsItem";
import { StatsValueSkeleton } from "components/Base/Skeletons/StyledSkeleton";

const ProtocolStats = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { tvl, loading, poolsLoading, totalBorrowed } = useProtocolStats();
  const { fxdPrice, fetchPricesInProgress } = usePricesContext();
  const { isMobile } = useSharedContext();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(poolsLoading || loading || fetchPricesInProgress);
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [poolsLoading, loading, fetchPricesInProgress, setIsLoading]);

  return (
    <BasePageStatsWrapper isLoading={isLoading}>
      <BasePageStatsItem
        title={"Total Issued"}
        helpText={
          "The total amount of FXD has been issued through borrowing from protocol and is currently in circulation."
        }
        value={
          isLoading ? (
            <StatsValueSkeleton
              height={isMobile ? "20px" : "26px"}
              width={isMobile ? "100px" : "200px"}
              marginTop={isMobile ? "0" : "8px"}
            />
          ) : (
            formatNumber(totalBorrowed) + " FXD"
          )
        }
        xs={12}
        sm={12}
        md={4}
        isMobileRow={true}
      />
      <BasePageStatsItem
        title={"TVL"}
        helpText={
          "TVL, or Total Value Locked, signifies the total amount of assets currently deposited in the platform and used to borrow FXD."
        }
        value={
          isLoading ? (
            <StatsValueSkeleton
              height={isMobile ? "20px" : "26px"}
              width={isMobile ? "100px" : "200px"}
              marginTop={isMobile ? "0" : "8px"}
            />
          ) : (
            formatCurrency(tvl)
          )
        }
        xs={12}
        sm={12}
        md={4}
        isMobileRow={true}
      />
      <BasePageStatsItem
        title={"FXD Price"}
        value={
          isLoading ? (
            <StatsValueSkeleton
              height={isMobile ? "20px" : "26px"}
              width={isMobile ? "100px" : "200px"}
              marginTop={isMobile ? "0" : "8px"}
            />
          ) : (
            formatCurrency(
              BigNumber(fxdPrice)
                .dividedBy(10 ** 18)
                .toNumber()
            )
          )
        }
        xs={12}
        sm={12}
        md={4}
        isMobileRow={true}
      />
    </BasePageStatsWrapper>
  );
};

export default ProtocolStats;
