import { AlertColor, Typography } from "@mui/material";
import { useRootStore } from "apps/lending/store/root";
import { GENERAL } from "apps/lending/utils/mixPanelEvents";

import { HealthFactorNumber } from "apps/lending/components/HealthFactorNumber";
import { BasicModal } from "apps/lending/components/primitives/BasicModal";
import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { Link } from "apps/lending/components/primitives/Link";
import { HFContent } from "apps/lending/modules/dashboard/LiquidationRiskParametresModal/components/HFContent";
import { InfoWrapper } from "apps/lending/modules/dashboard/LiquidationRiskParametresModal/components/InfoWrapper";
import { LTVContent } from "apps/lending/modules/dashboard/LiquidationRiskParametresModal/components/LTVContent";
import { FC } from "react";

interface LiquidationRiskParametersInfoModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  healthFactor: string;
  loanToValue: string;
  currentLoanToValue: string;
  currentLiquidationThreshold: string;
}

export const LiquidationRiskParametersInfoModal: FC<
  LiquidationRiskParametersInfoModalProps
> = ({
  open,
  setOpen,
  healthFactor,
  loanToValue,
  currentLoanToValue,
  currentLiquidationThreshold,
}) => {
  let healthFactorColor: AlertColor = "success";
  const hf = Number(healthFactor);
  if (hf > 1.1 && hf <= 3) {
    healthFactorColor = "warning";
  } else if (hf <= 1.1) {
    healthFactorColor = "error";
  }
  const trackEvent = useRootStore((store) => store.trackEvent);

  let ltvColor: AlertColor = "success";
  const ltvPercent = Number(loanToValue) * 100;
  const currentLtvPercent = Number(currentLoanToValue) * 100;
  const liquidationThresholdPercent = Number(currentLiquidationThreshold) * 100;
  if (ltvPercent >= Math.min(currentLtvPercent, liquidationThresholdPercent)) {
    ltvColor = "error";
  } else if (
    ltvPercent > currentLtvPercent / 2 &&
    ltvPercent < currentLtvPercent
  ) {
    ltvColor = "warning";
  }

  return (
    <BasicModal open={open} setOpen={setOpen}>
      <Typography variant="h2" mb={6} color="primary.main">
        Liquidation risk parameters
      </Typography>
      <Typography mb={6}>
        Your health factor and loan to value determine the assurance of your
        collateral. To avoid liquidations you can supply more collateral or
        repay borrow positions.{" "}
        <Link
          onClick={() => {
            trackEvent(GENERAL.EXTERNAL_LINK, {
              Link: "HF Risk Link",
            });
          }}
          href="https://docs.aave.com/faq/"
          sx={{ textDecoration: "underline" }}
          color="text.primary"
          variant="description"
        >
          Learn more
        </Link>
      </Typography>

      <InfoWrapper
        topTitle={"Health factor"}
        topDescription={
          <>
            Safety of your deposited collateral against the borrowed assets and
            its underlying value.
          </>
        }
        topValue={
          <HealthFactorNumber
            value={healthFactor}
            variant="main12"
            sx={{ color: "common.white" }}
          />
        }
        bottomText={
          <>
            If the health factor goes below 1, the liquidation of your
            collateral might be triggered.
          </>
        }
        color={healthFactorColor}
      >
        <HFContent healthFactor={healthFactor} />
      </InfoWrapper>

      <InfoWrapper
        topTitle={"Current LTV"}
        topDescription={
          <>Your current loan to value based on your collateral supplied.</>
        }
        topValue={
          <FormattedNumber
            value={loanToValue}
            percent
            variant="main12"
            color="common.white"
            symbolsColor="common.white"
          />
        }
        bottomText={
          <>
            If your loan to value goes above the liquidation threshold your
            collateral supplied may be liquidated.
          </>
        }
        color={ltvColor}
      >
        <LTVContent
          loanToValue={loanToValue}
          currentLoanToValue={currentLoanToValue}
          currentLiquidationThreshold={currentLiquidationThreshold}
          color={ltvColor}
        />
      </InfoWrapper>
    </BasicModal>
  );
};
