import { Box, Grid, styled, Typography } from "@mui/material";
import BigNumber from "bignumber.js";
import useVaultContext from "context/vault";
import usePricesContext from "context/prices";
import useSharedContext from "context/shared";
import { formatNumber } from "utils/format";
import { StatsValueSkeleton } from "components/AppComponents/AppSkeleton/AppSkeleton";
import { memo, useEffect, useRef, useState } from "react";
import useWindowResize from "hooks/General/useWindowResize";

const VaultPositionTitle = styled(Typography)`
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  margin-bottom: 12px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 16px;
  }
`;

const PositionStatItem = styled(Grid)`
  & > .MuiBox-root {
    border-radius: 12px;
    border: 1px solid #2c4066;
    background: #132340;
    padding: 12px 24px;
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    height: auto !important;
    margin: 0 !important;
    & > .MuiBox-root {
      border: none;
      background: #1e2f4c;
      padding: 12px 16px;
    }
  }
`;

const PositionStatItemTitle = styled(Box)`
  color: #6d86b2;
  font-size: 13px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0.13px;
  text-transform: uppercase;
  margin-bottom: 4px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.48px;
    text-transform: capitalize;
    margin-bottom: 0;
  }
`;

const PositionStatItemValue = styled(Box)`
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  line-height: 36px;
  word-wrap: break-word;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.14px;
  }
`;

const UsdValue = styled(Box)`
  color: #6d86b2;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
`;

const VaultPositionStats = () => {
  const {
    vault,
    vaultLoading,
    vaultPosition,
    vaultPositionLoading,
    balanceEarned,
    tfVaultDepositLimit,
    isTfVaultType,
  } = useVaultContext();
  const { fxdPrice, fetchPricesInProgress } = usePricesContext();
  const { isMobile } = useSharedContext();
  const container = useRef<HTMLElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [width, height] = useWindowResize();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (container.current && !isLoading) {
      timer = setTimeout(() => {
        const blocks = (container.current as HTMLElement).querySelectorAll(
          ".position-stats-item"
        );
        const heights: number[] = [];
        blocks.forEach((block) => {
          const childs = (block.firstChild as HTMLElement).getElementsByTagName(
            "div"
          );
          const totalHeight = Array.from(childs)
            .slice(0, 2)
            .reduce(
              (accumulator, currentItem) =>
                accumulator + currentItem.offsetHeight,
              0
            );

          /**
           * 24 is the padding of the parent element
           */
          heights.push(totalHeight + 24);
        });
        const maxHeight = Math.max(...heights);
        blocks.forEach((block) => {
          (block.firstChild as HTMLElement).style.height = `${maxHeight}px`;
          (block as HTMLElement).style.height = `${maxHeight + 12}px`;
        });
      });
    }

    return () => {
      timer && clearTimeout(timer);
    };
  }, [container, vault, isLoading, fetchPricesInProgress, width, height]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(vaultLoading || vaultPositionLoading);
    }, 300);

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [vaultLoading, vaultPositionLoading, setIsLoading]);

  const getVaultDepositLimit = () => {
    if (isTfVaultType) {
      return BigNumber(tfVaultDepositLimit).dividedBy(10 ** 18);
    } else {
      return BigNumber.max(
        BigNumber(vault?.depositLimit || 0)
          .minus(vault?.balanceTokens || 0)
          .dividedBy(10 ** 18)
          .toNumber(),
        0
      );
    }
  };

  return (
    <Box pb={isMobile ? "20px" : "24px"} ref={container}>
      <VaultPositionTitle variant="h1">Your Position</VaultPositionTitle>
      <Grid container spacing={isMobile ? 0.5 : 1.5}>
        <PositionStatItem
          item
          xs={6}
          sm={6}
          md={3.75}
          className={"position-stats-item"}
        >
          <Box>
            <PositionStatItemTitle>Total Deposited</PositionStatItemTitle>
            <PositionStatItemValue>
              {isLoading ? (
                <StatsValueSkeleton
                  height={isMobile ? 40 : 42}
                  width={"100%"}
                  isMobile={isMobile}
                />
              ) : (
                <>
                  {formatNumber(
                    BigNumber(vault?.balanceTokens || 0)
                      .dividedBy(10 ** 18)
                      .toNumber()
                  ) +
                    " " +
                    vault?.token?.symbol}
                  <UsdValue>
                    {"$" +
                      formatNumber(
                        BigNumber(vault?.balanceTokens || 0)
                          .multipliedBy(fxdPrice)
                          .dividedBy(10 ** 36)
                          .toNumber()
                      )}
                  </UsdValue>
                </>
              )}
            </PositionStatItemValue>
          </Box>
        </PositionStatItem>
        <PositionStatItem
          item
          xs={6}
          sm={6}
          md={3.75}
          className={"position-stats-item"}
        >
          <Box>
            <PositionStatItemTitle>Available</PositionStatItemTitle>
            <PositionStatItemValue>
              {isLoading ? (
                <StatsValueSkeleton
                  height={isMobile ? 40 : 42}
                  width={"100%"}
                  isMobile={isMobile}
                />
              ) : (
                <>
                  {formatNumber(getVaultDepositLimit().toNumber())}{" "}
                  {vault?.token?.symbol}
                  <UsdValue>
                    {"$" +
                      formatNumber(
                        getVaultDepositLimit()
                          .multipliedBy(fxdPrice)
                          .dividedBy(10 ** 18)
                          .toNumber()
                      )}
                  </UsdValue>
                </>
              )}
            </PositionStatItemValue>
          </Box>
        </PositionStatItem>
        <PositionStatItem
          item
          xs={6}
          sm={6}
          md={2.25}
          className={"position-stats-item"}
        >
          <Box>
            <PositionStatItemTitle>Balance</PositionStatItemTitle>
            <PositionStatItemValue>
              {isLoading ? (
                <StatsValueSkeleton
                  height={isMobile ? 40 : 42}
                  width={"100%"}
                  isMobile={isMobile}
                />
              ) : (
                <>
                  {formatNumber(
                    BigNumber(vaultPosition?.balancePosition || 0)
                      .dividedBy(10 ** 18)
                      .toNumber()
                  ) +
                    " " +
                    vault?.token?.symbol}
                  <UsdValue>
                    {"$" +
                      formatNumber(
                        BigNumber(vaultPosition?.balancePosition || 0)
                          .multipliedBy(fxdPrice)
                          .dividedBy(10 ** 36)
                          .toNumber()
                      )}
                  </UsdValue>
                </>
              )}
            </PositionStatItemValue>
          </Box>
        </PositionStatItem>
        <PositionStatItem
          item
          xs={6}
          sm={6}
          md={2.25}
          className={"position-stats-item"}
        >
          <Box>
            <PositionStatItemTitle>Earned</PositionStatItemTitle>
            <PositionStatItemValue>
              <>
                {isLoading || balanceEarned === -1 ? (
                  <StatsValueSkeleton
                    height={isMobile ? 40 : 42}
                    width={"100%"}
                    isMobile={isMobile}
                  />
                ) : BigNumber(balanceEarned).isGreaterThan(0) ? (
                  <>
                    {formatNumber(Number(balanceEarned)) +
                      " " +
                      vault?.token?.symbol}
                    <UsdValue>
                      {"$" +
                        formatNumber(
                          BigNumber(balanceEarned || "0")
                            .multipliedBy(fxdPrice)
                            .dividedBy(10 ** 18)
                            .toNumber()
                        )}
                    </UsdValue>
                  </>
                ) : (
                  <>
                    0 {vault?.token?.symbol}
                    <UsdValue>$0</UsdValue>
                  </>
                )}
              </>
            </PositionStatItemValue>
          </Box>
        </PositionStatItem>
      </Grid>
    </Box>
  );
};

export default memo(VaultPositionStats);
