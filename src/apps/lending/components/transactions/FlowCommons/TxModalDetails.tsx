import { ReserveIncentiveResponse } from "@into-the-fathom/lending-math-utils/dist/esm/formatters/incentive/calculate-reserve-incentives";
import {
  Box,
  FormControlLabel,
  Skeleton,
  SvgIcon,
  Switch,
  Typography,
} from "@mui/material";
import { parseUnits } from "fathom-ethers/lib/utils";
import { FC, memo, ReactNode } from "react";
import {
  IsolatedDisabledBadge,
  IsolatedEnabledBadge,
  UnavailableDueToIsolationBadge,
} from "apps/lending/components/isolationMode/IsolatedBadge";
import { Row } from "apps/lending/components/primitives/Row";
import { CollateralType } from "apps/lending/helpers/types";

import { HealthFactorNumber } from "apps/lending/components/HealthFactorNumber";
import { IncentivesButton } from "apps/lending/components/incentives/IncentivesButton";
import {
  FormattedNumber,
  FormattedNumberProps,
} from "apps/lending/components/primitives/FormattedNumber";
import { TokenIcon } from "apps/lending/components/primitives/TokenIcon";
import { GasStation } from "apps/lending/components/transactions/GasStation/GasStation";

import EastRoundedIcon from "@mui/icons-material/EastRounded";

export interface TxModalDetailsProps {
  gasLimit?: string;
  slippageSelector?: ReactNode;
  skipLoad?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

const ArrowRightIcon = (
  <SvgIcon color="primary" sx={{ fontSize: "14px", mx: 0.5 }}>
    <EastRoundedIcon />
  </SvgIcon>
);

export const TxModalDetails: FC<TxModalDetailsProps> = memo(
  ({ gasLimit, slippageSelector, skipLoad, disabled, children }) => {
    return (
      <Box sx={{ pt: 2 }}>
        <Typography sx={{ mb: 2 }} color="text.secondary">
          Transaction overview
        </Typography>

        <Box
          sx={() => ({
            ".MuiBox-root:last-of-type": {
              mb: 0,
            },
          })}
        >
          {children}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <GasStation
            gasLimit={parseUnits(gasLimit || "0", "wei")}
            skipLoad={skipLoad}
            disabled={disabled}
            rightComponent={slippageSelector}
          />
        </Box>
      </Box>
    );
  }
);

interface DetailsNumberLineProps extends FormattedNumberProps {
  description: ReactNode;
  value: FormattedNumberProps["value"];
  futureValue?: FormattedNumberProps["value"];
  numberPrefix?: ReactNode;
  iconSymbol?: string;
  loading?: boolean;
  decimals?: number;
}

export const DetailsNumberLine: FC<DetailsNumberLineProps> = memo(
  ({
    description,
    value,
    futureValue,
    numberPrefix,
    iconSymbol,
    loading = false,
    decimals,
    ...rest
  }) => {
    return (
      <Row caption={description} captionVariant="description" mb={2}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {loading ? (
            <Skeleton
              variant="rectangular"
              height={20}
              width={100}
              sx={{ borderRadius: "4px" }}
            />
          ) : (
            <>
              {iconSymbol && (
                <TokenIcon
                  symbol={iconSymbol}
                  sx={{ mr: 1, fontSize: "16px" }}
                />
              )}
              {numberPrefix && (
                <Typography sx={{ mr: 1 }}>{numberPrefix}</Typography>
              )}
              <FormattedNumber
                value={value}
                visibleDecimals={decimals}
                variant="secondary14"
                {...rest}
              />
              {futureValue && (
                <>
                  {ArrowRightIcon}
                  <FormattedNumber
                    value={futureValue}
                    variant="secondary14"
                    {...rest}
                  />
                </>
              )}
            </>
          )}
        </Box>
      </Row>
    );
  }
);

interface DetailsNumberLineWithSubProps {
  description: ReactNode;
  symbol: ReactNode;
  value?: string;
  valueUSD?: string;
  futureValue: string;
  futureValueUSD: string;
  hideSymbolSuffix?: boolean;
  color?: string;
  tokenIcon?: string;
  loading?: boolean;
  decimals?: number;
}

export const DetailsNumberLineWithSub: FC<DetailsNumberLineWithSubProps> = memo(
  ({
    description,
    symbol,
    value,
    valueUSD,
    futureValue,
    futureValueUSD,
    hideSymbolSuffix,
    color,
    tokenIcon,
    loading = false,
    decimals,
  }) => {
    return (
      <Row
        caption={description}
        captionVariant="description"
        mb={4}
        align="flex-start"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          {loading ? (
            <>
              <Skeleton
                variant="rectangular"
                height={20}
                width={100}
                sx={{ borderRadius: "4px" }}
              />
              <Skeleton
                variant="rectangular"
                height={15}
                width={80}
                sx={{ borderRadius: "4px", marginTop: "4px" }}
              />
            </>
          ) : (
            <>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {value && (
                  <>
                    <FormattedNumber
                      value={value}
                      visibleDecimals={decimals}
                      variant="secondary14"
                      color={color}
                    />
                    {!hideSymbolSuffix && (
                      <Typography ml={1} variant="secondary14">
                        {symbol}
                      </Typography>
                    )}
                    {ArrowRightIcon}
                  </>
                )}
                {tokenIcon && (
                  <TokenIcon
                    symbol={tokenIcon}
                    sx={{ mr: 1, fontSize: "14px" }}
                  />
                )}
                <FormattedNumber
                  visibleDecimals={decimals}
                  value={futureValue}
                  variant="secondary14"
                  color={color}
                />
                {!hideSymbolSuffix && (
                  <Typography ml={1} variant="secondary14">
                    {symbol}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {valueUSD && (
                  <>
                    <FormattedNumber
                      value={valueUSD}
                      variant="helperText"
                      compact
                      symbol="USD"
                    />
                    {ArrowRightIcon}
                  </>
                )}
                <FormattedNumber
                  sx={{ pt: 0.5 }}
                  value={futureValueUSD}
                  variant="helperText"
                  compact
                  symbol="USD"
                />
              </Box>
            </>
          )}
        </Box>
      </Row>
    );
  }
);

export interface DetailsCollateralLine {
  collateralType: CollateralType;
}

export const DetailsCollateralLine: FC<DetailsCollateralLine> = ({
  collateralType,
}) => {
  return (
    <Row caption={"Collateralization"} captionVariant="description" mb={2}>
      <CollateralState collateralType={collateralType} />
    </Row>
  );
};

interface CollateralStateProps {
  collateralType: CollateralType;
}

export const CollateralState: FC<CollateralStateProps> = ({
  collateralType,
}) => {
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center" }}>
      {
        {
          [CollateralType.ENABLED]: (
            <Typography variant="description" color="success.main">
              Enabled
            </Typography>
          ),
          [CollateralType.ISOLATED_ENABLED]: (
            <IsolatedEnabledBadge
              typographyProps={{
                variant: "description",
                color: "warning.main",
              }}
            />
          ),
          [CollateralType.DISABLED]: (
            <Typography variant="description" color="error.main">
              Disabled
            </Typography>
          ),
          [CollateralType.UNAVAILABLE]: (
            <Typography variant="description" color="error.main">
              Unavailable
            </Typography>
          ),
          [CollateralType.ISOLATED_DISABLED]: <IsolatedDisabledBadge />,
          [CollateralType.UNAVAILABLE_DUE_TO_ISOLATION]: (
            <UnavailableDueToIsolationBadge />
          ),
        }[collateralType]
      }
    </Box>
  );
};

interface DetailsIncentivesLineProps {
  futureIncentives?: ReserveIncentiveResponse[];
  futureSymbol?: string;
  incentives?: ReserveIncentiveResponse[];
  // the token yielding the incentive, not the incentive itself
  symbol: string;
  loading?: boolean;
}

export const DetailsIncentivesLine: FC<DetailsIncentivesLineProps> = memo(
  ({ incentives, symbol, futureIncentives, futureSymbol, loading = false }) => {
    if (
      !incentives ||
      incentives.filter((i) => i.incentiveAPR !== "0").length === 0
    )
      return null;
    return (
      <Row
        caption={"Rewards APR"}
        captionVariant="description"
        mb={4}
        minHeight={24}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {loading ? (
            <Skeleton
              variant="rectangular"
              height={20}
              width={100}
              sx={{ borderRadius: "4px" }}
            />
          ) : (
            <>
              <IncentivesButton incentives={incentives} symbol={symbol} />
              {futureSymbol && (
                <>
                  {ArrowRightIcon}
                  <IncentivesButton
                    incentives={futureIncentives}
                    symbol={futureSymbol}
                  />
                  {futureIncentives && futureIncentives.length === 0 && (
                    <Typography variant="secondary14">None</Typography>
                  )}
                </>
              )}
            </>
          )}
        </Box>
      </Row>
    );
  }
);

export interface DetailsHFLineProps {
  healthFactor: string;
  futureHealthFactor: string;
  visibleHfChange: boolean;
  loading?: boolean;
}

export const DetailsHFLine: FC<DetailsHFLineProps> = memo(
  ({ healthFactor, futureHealthFactor, visibleHfChange, loading = false }) => {
    if (healthFactor === "-1" && futureHealthFactor === "-1") return null;

    return (
      <Row
        caption={"Health factor"}
        captionVariant="description"
        mb={4}
        align="flex-start"
      >
        <Box sx={{ textAlign: "right" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            {loading ? (
              <Skeleton
                variant="rectangular"
                height={20}
                width={80}
                sx={{ borderRadius: "4px" }}
              />
            ) : (
              <>
                <HealthFactorNumber
                  value={healthFactor}
                  variant="secondary14"
                />

                {visibleHfChange && (
                  <>
                    {ArrowRightIcon}

                    <HealthFactorNumber
                      value={
                        isNaN(Number(futureHealthFactor))
                          ? healthFactor
                          : futureHealthFactor
                      }
                      variant="secondary14"
                    />
                  </>
                )}
              </>
            )}
          </Box>

          <Typography variant="helperText" color="text.secondary">
            Liquidation at
            {" <1.0"}
          </Typography>
        </Box>
      </Row>
    );
  }
);

export interface DetailsUnwrapSwitchProps {
  unwrapped: boolean;
  setUnWrapped: (value: boolean) => void;
  label: ReactNode;
}

export const DetailsUnwrapSwitch: FC<DetailsUnwrapSwitchProps> = memo(
  ({ unwrapped, setUnWrapped, label }) => {
    return (
      <Row captionVariant="description" sx={{ mt: 2 }}>
        <FormControlLabel
          sx={{ mx: 0 }}
          control={
            <Switch
              disableRipple
              checked={unwrapped}
              onClick={() => setUnWrapped(!unwrapped)}
              data-cy={"wrappedSwitcher"}
            />
          }
          labelPlacement="end"
          label={label}
        />
      </Row>
    );
  }
);
