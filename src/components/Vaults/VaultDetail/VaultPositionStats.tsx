import { Box, Grid, styled, Typography } from "@mui/material";
import BigNumber from "bignumber.js";
import useVaultContext from "context/vault";
import usePricesContext from "context/prices";
import useSharedContext from "context/shared";
import { formatNumber } from "utils/format";
import { StatsValueSkeleton } from "components/AppComponents/AppSkeleton/AppSkeleton";

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
  word-break: break-all;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.14px;
  }
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

  return (
    <Box pb={isMobile ? "20px" : "24px"}>
      <VaultPositionTitle variant="h1">Your Position</VaultPositionTitle>
      <Grid container spacing={isMobile ? 0.5 : 1.5}>
        <PositionStatItem item xs={6} sm={6} md={3.75}>
          <Box>
            <PositionStatItemTitle>Total Deposited</PositionStatItemTitle>
            <PositionStatItemValue>
              {vaultLoading || !vault.id ? (
                <StatsValueSkeleton
                  height={isMobile ? 20 : 28}
                  width={"100%"}
                  isMobile={isMobile}
                />
              ) : (
                formatNumber(
                  BigNumber(vault?.balanceTokens || 0)
                    .dividedBy(10 ** 18)
                    .toNumber()
                ) +
                " " +
                vault?.token.symbol
              )}
            </PositionStatItemValue>
          </Box>
        </PositionStatItem>
        <PositionStatItem item xs={6} sm={6} md={3.75}>
          <Box>
            <PositionStatItemTitle>Available</PositionStatItemTitle>
            <PositionStatItemValue>
              {vaultLoading || !vault.id ? (
                <StatsValueSkeleton
                  height={isMobile ? 20 : 28}
                  width={"100%"}
                  isMobile={isMobile}
                />
              ) : (
                `${formatNumber(
                  Math.max(
                    BigNumber(vault?.depositLimit || 0)
                      .minus(BigNumber(vault?.balanceTokens || 0))
                      .dividedBy(10 ** 18)
                      .toNumber(),
                    0
                  )
                )} ${vault?.token.symbol}`
              )}
            </PositionStatItemValue>
          </Box>
        </PositionStatItem>
        <PositionStatItem item xs={6} sm={6} md={2.25}>
          <Box>
            <PositionStatItemTitle>Balance</PositionStatItemTitle>
            <PositionStatItemValue>
              {vaultLoading || vaultPositionLoading ? (
                <StatsValueSkeleton
                  height={isMobile ? 20 : 28}
                  width={"100%"}
                  isMobile={isMobile}
                />
              ) : (
                "$" +
                formatNumber(
                  BigNumber(vaultPosition?.balancePosition || 0)
                    .multipliedBy(fxdPrice)
                    .dividedBy(10 ** 36)
                    .toNumber()
                )
              )}
            </PositionStatItemValue>
          </Box>
        </PositionStatItem>
        <PositionStatItem item xs={6} sm={6} md={2.25}>
          <Box>
            <PositionStatItemTitle>Earned</PositionStatItemTitle>
            <PositionStatItemValue>
              <>
                {vaultLoading ||
                vaultPositionLoading ||
                balanceEarned === -1 ? (
                  <StatsValueSkeleton
                    height={isMobile ? 20 : 28}
                    width={"100%"}
                    isMobile={isMobile}
                  />
                ) : BigNumber(balanceEarned).isGreaterThan(0) ? (
                  "$" +
                  formatNumber(
                    BigNumber(balanceEarned || "0")
                      .multipliedBy(fxdPrice)
                      .dividedBy(10 ** 18)
                      .toNumber()
                  )
                ) : (
                  0
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
