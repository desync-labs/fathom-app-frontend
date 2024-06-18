import { Box, Grid, styled, Typography } from "@mui/material";
import BigNumber from "bignumber.js";
import useVaultContext from "context/vault";
import usePricesContext from "context/prices";
import useSharedContext from "context/shared";
import { formatNumber } from "utils/format";
import { StatsValueSkeleton } from "components/AppComponents/AppSkeleton/AppSkeleton";
import { useEffect, useRef } from "react";

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
  } = useVaultContext();
  const { fxdPrice } = usePricesContext();
  const { isMobile } = useSharedContext();
  const container = useRef<HTMLElement>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (container.current && !vaultLoading && !vaultPositionLoading) {
      timer = setTimeout(() => {
        const blocks = (container.current as HTMLElement).querySelectorAll(
          ".position-stats-item"
        );
        const heights: number[] = [];
        blocks.forEach((block) => {
          heights.push((block.firstChild as HTMLElement).offsetHeight);
        });
        const maxHeight = Math.max(...heights);
        blocks.forEach((block, index) => {
          (block.firstChild as HTMLElement).style.height = `${maxHeight}px`;
          (block as HTMLElement).style.height = `${maxHeight + 12}px`;
          if (isMobile) {
            if (index % 2 === 0) {
              (block.firstChild as HTMLElement).style.marginRight = "5px";
            }
            if (index > 1) {
              (block.firstChild as HTMLElement).style.marginTop = "5px";
              (block as HTMLElement).style.marginTop = `5px`;
            }
          }
        });
      }, 100);
    }

    return () => {
      timer && clearTimeout(timer);
    };
  }, [container, vault, vaultLoading, vaultPositionLoading, isMobile]);

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
              {vaultLoading || !vault.id ? (
                <StatsValueSkeleton
                  height={isMobile ? 20 : 48}
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
              {vaultLoading || !vault.id ? (
                <StatsValueSkeleton
                  height={isMobile ? 20 : 48}
                  width={"100%"}
                  isMobile={isMobile}
                />
              ) : (
                <>
                  {formatNumber(
                    Math.max(
                      BigNumber(vault?.depositLimit || 0)
                        .minus(vault?.balanceTokens || 0)
                        .dividedBy(10 ** 18)
                        .toNumber(),
                      0
                    )
                  )}{" "}
                  {vault?.token?.symbol}
                  <UsdValue>
                    {"$" +
                      formatNumber(
                        BigNumber.max(
                          BigNumber(vault?.depositLimit || 0)
                            .minus(vault?.balanceTokens || 0)
                            .dividedBy(10 ** 18)
                            .toNumber(),
                          0
                        )
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
              {vaultLoading || vaultPositionLoading ? (
                <StatsValueSkeleton
                  height={isMobile ? 20 : 48}
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
                {vaultLoading ||
                vaultPositionLoading ||
                balanceEarned === -1 ? (
                  <StatsValueSkeleton
                    height={isMobile ? 20 : 48}
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

export default VaultPositionStats;
