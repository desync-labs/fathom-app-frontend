import { API_ETH_MOCK_ADDRESS } from "@into-the-fathom/lending-contract-helpers";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import { Box, CircularProgress, Stack } from "@mui/material";
import { BigNumber } from "fathom-ethers";
import { formatUnits, parseUnits } from "fathom-ethers/lib/utils";
import { FC, ReactNode } from "react";
import { GasTooltip } from "apps/lending/components/infoTooltips/GasTooltip";
import { Warning } from "apps/lending/components/primitives/Warning";
import { useWalletBalances } from "apps/lending/hooks/app-data-provider/useWalletBalances";
import { useGasStation } from "apps/lending/hooks/useGasStation";
import { useModalContext } from "apps/lending/hooks/useModal";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";

import { useAppDataContext } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { GasPriceData } from "apps/lending/hooks/useGetGasPrices";
import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { GasOption } from "apps/lending/components/transactions/GasStation/GasStationProvider";

export interface GasStationProps {
  gasLimit: BigNumber;
  skipLoad?: boolean;
  disabled?: boolean;
  rightComponent?: ReactNode;
}

export const getGasCosts = (
  gasLimit: BigNumber,
  gasOption: GasOption,
  customGas: string,
  gasData: GasPriceData,
  baseCurrencyUsd: string
) => {
  const gasPrice =
    gasOption === GasOption.Custom
      ? parseUnits(customGas, "gwei").toString()
      : (gasData as any)[gasOption].legacyGasPrice;

  return (
    Number(formatUnits(gasLimit.mul(gasPrice), 18)) *
    parseFloat(baseCurrencyUsd)
  );
};

export const GasStation: FC<GasStationProps> = ({
  gasLimit,
  skipLoad,
  disabled,
  rightComponent,
}) => {
  const {
    state,
    gasPriceData: { data },
  } = useGasStation();

  const { walletBalances } = useWalletBalances();
  const nativeBalanceUSD =
    walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()]?.amountUSD;

  const { reserves } = useAppDataContext();
  const { currentNetworkConfig } = useProtocolDataContext();
  const { name, baseAssetSymbol, wrappedBaseAssetSymbol } =
    currentNetworkConfig;

  const { loadingTxns } = useModalContext();

  const wrappedAsset = reserves.find(
    (token) =>
      token.symbol.toLowerCase() === wrappedBaseAssetSymbol?.toLowerCase()
  );

  const totalGasCostsUsd =
    data && wrappedAsset
      ? getGasCosts(
          gasLimit,
          state.gasOption,
          state.customGas,
          data,
          wrappedAsset.priceInUSD
        )
      : undefined;

  return (
    <Stack gap={6} sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LocalGasStationIcon
            color="primary"
            sx={{ fontSize: "16px", mr: 0.5 }}
          />

          {loadingTxns && !skipLoad ? (
            <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />
          ) : totalGasCostsUsd && !disabled ? (
            <>
              <FormattedNumber
                value={totalGasCostsUsd}
                symbol="USD"
                color="text.secondary"
              />
              <GasTooltip />
            </>
          ) : (
            "-"
          )}
        </Box>
        {rightComponent}
      </Box>
      {!disabled && Number(nativeBalanceUSD) < Number(totalGasCostsUsd) && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Warning severity="warning" sx={{ mb: 0, mx: "auto" }}>
            You do not have enough {baseAssetSymbol} in your account to pay for
            transaction fees on {name} network. Please deposit {baseAssetSymbol}{" "}
            from another account.
          </Warning>
        </Box>
      )}
    </Stack>
  );
};
