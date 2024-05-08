import { Box, Grid, styled, Typography } from "@mui/material";
import BigNumber from "bignumber.js";
import useVaultContext from "context/vault";
import usePricesContext from "context/prices";
import { formatNumber } from "utils/format";

const VaultPositionTitle = styled(Typography)`
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  margin-bottom: 12px;
`;

const PositionStatItem = styled(Grid)`
  border-radius: 12px;
  border: 1px solid #2c4066;
  background: #132340;
  padding: 12px 24px;
`;
const PositionStatItemTitle = styled(Box)`
  color: #6d86b2;
  font-size: 13px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0.13px;
  text-transform: uppercase;
  margin-bottom: 4px;
`;
const PositionStatItemValue = styled(Box)`
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  line-height: 36px;
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

  // useEffect(() => {
  //   console.log("vaultPositionLoading", vaultPositionLoading);
  //   console.log("vaultPosition", vaultPosition);
  //   console.log(111, balanceToken);
  // }, [vaultPositionLoading, vaultPosition, balanceToken]);
  //
  // useEffect(() => {
  //   console.log("balanceEarned", balanceEarned);
  // }, [balanceEarned]);
  return (
    <Box pb={"24px"}>
      <VaultPositionTitle variant="h1">Your Position</VaultPositionTitle>
      <Grid container gap={1.5}>
        <PositionStatItem item xs={4}>
          <PositionStatItemTitle>Total Deposited</PositionStatItemTitle>
          <PositionStatItemValue>
            {vaultLoading
              ? "Loading..."
              : formatNumber(
                  BigNumber(vault?.balanceTokens || 0)
                    .dividedBy(10 ** 18)
                    .toNumber()
                ) +
                " " +
                vault?.token.symbol}
          </PositionStatItemValue>
        </PositionStatItem>
        <PositionStatItem item xs={2.5}>
          <PositionStatItemTitle>Available</PositionStatItemTitle>
          <PositionStatItemValue>
            {formatNumber(
              Math.max(
                BigNumber(vault?.depositLimit || 0)
                  .minus(BigNumber(vault?.balanceTokens || 0))
                  .dividedBy(10 ** 18)
                  .toNumber(),
                0
              )
            )}{" "}
            {vault?.token.symbol}
          </PositionStatItemValue>
        </PositionStatItem>
        <PositionStatItem item xs={2.5}>
          <PositionStatItemTitle>Balance</PositionStatItemTitle>
          <PositionStatItemValue>
            {vaultPositionLoading
              ? "Loading..."
              : "$" +
                formatNumber(
                  BigNumber(vaultPosition?.balancePosition || 0)
                    .multipliedBy(fxdPrice)
                    .dividedBy(10 ** 36)
                    .toNumber()
                )}
          </PositionStatItemValue>
        </PositionStatItem>
        <PositionStatItem item xs={2.5}>
          <PositionStatItemTitle>Earned</PositionStatItemTitle>
          <PositionStatItemValue>
            $
            {BigNumber(balanceEarned).isGreaterThan(0)
              ? formatNumber(
                  BigNumber(balanceEarned || "0")
                    .multipliedBy(fxdPrice)
                    .dividedBy(10 ** 18)
                    .toNumber()
                )
              : "0"}
          </PositionStatItemValue>
        </PositionStatItem>
      </Grid>
    </Box>
  );
};

export default VaultPositionStats;
