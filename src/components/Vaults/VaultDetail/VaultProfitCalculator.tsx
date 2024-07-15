import { ChangeEvent, memo, useState } from "react";
import BigNumber from "bignumber.js";
import { Box, styled, Typography } from "@mui/material";

import useVaultContext from "context/vault";
import usePricesContext from "context/prices";
import { formatNumber } from "utils/format";
import { getTokenLogoURL } from "utils/tokenLogo";
import { getPeriodInDays } from "utils/getPeriodInDays";
import { useApr } from "hooks/Vaults/useApr";
import { InfoIcon } from "components/Governance/Propose";
import { VaultPaper } from "components/AppComponents/AppPaper/AppPaper";
import { AppFlexBox } from "components/AppComponents/AppBox/AppBox";
import { CustomSkeleton } from "components/Base/Skeletons/StyledSkeleton";
import {
  AppFormInputErrorWrapper,
  AppFormInputUsdIndicator,
  AppFormInputWrapperV2,
  AppFormLabelRow,
  AppFormLabelV2,
  AppTextFieldV2,
} from "components/AppComponents/AppForm/AppForm";

const SummaryWrapper = styled(AppFlexBox)`
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
`;

const CalculatorInputWrapper = styled(AppFormInputWrapperV2)`
  width: 100%;
  margin-bottom: 0;
`;

const CalculatorTextField = styled(AppTextFieldV2)`
  input,
  textarea {
    height: 30px;
    padding: 8px 8px 8px 121px;
  }

  & input:disabled,
  textarea:disabled {
    height: 30px;
    color: #3da329;
    padding: 8px;

    &:hover,
    &:focus {
      box-shadow: unset;
    }
  }
`;

const CalculatorUsdIndicator = styled(AppFormInputUsdIndicator)`
  top: 37px;
  left: unset;
  right: 8px;
`;

const InputTokenLabelRow = styled(AppFormLabelRow)`
  position: absolute;
  top: 32px;
  left: 8px;
  height: 32px;
  gap: 8px;
  border-radius: 8px;
  background: #253656;
  padding: 8px 16px;

  img {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    margin-bottom: -1px;
  }
`;
const InputTokenLabelSymbol = styled("div")`
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
`;

const InputTokenLabel = ({ tokenSymbol }: { tokenSymbol: string }) => {
  return (
    <InputTokenLabelRow>
      <img src={getTokenLogoURL(tokenSymbol)} alt={tokenSymbol} />
      <InputTokenLabelSymbol>{tokenSymbol}</InputTokenLabelSymbol>
    </InputTokenLabelRow>
  );
};

const getEstimatedEarning = (
  depositAmount: string,
  apy: string,
  days: number
): string => {
  if (
    !depositAmount ||
    !days ||
    BigNumber(depositAmount).isLessThanOrEqualTo("0") ||
    BigNumber(apy).isEqualTo("0")
  ) {
    return "0";
  }

  const principal = BigNumber(depositAmount);
  const annualRate = BigNumber(apy).div(100);
  const timeInYears = BigNumber(days).div(365);

  const profit = principal.times(annualRate).times(timeInYears);

  return profit.toFixed(2);
};

const VaultProfitCalculator = () => {
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const [estimatedEarning, setEstimatedEarning] = useState<string>("0");

  const { vault, isTfVaultType, tfVaultDepositEndDate, tfVaultLockEndDate } =
    useVaultContext();
  const { fxdPrice } = usePricesContext();
  const { token } = vault;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    let period = 365;

    if (isTfVaultType) {
      period = getPeriodInDays(tfVaultDepositEndDate, tfVaultLockEndDate);
    }

    setTokenAmount(e.target.value);
    setEstimatedEarning(
      getEstimatedEarning(e.target.value, useApr(vault), period)
    );
  };

  if (!token) {
    return (
      <VaultPaper sx={{ marginBottom: "24px" }}>
        <SummaryWrapper>
          <Typography variant="h3" sx={{ fontSize: "16px" }}>
            Annual Percentage Yield (APY) Calculator
          </Typography>
        </SummaryWrapper>
        <AppFlexBox mt="12px" sx={{ flexDirection: "row" }}>
          <CustomSkeleton
            variant="rounded"
            animation={"wave"}
            width="50%"
            height="72px"
          />
          <CustomSkeleton
            variant="rounded"
            animation={"wave"}
            width="50%"
            height="72px"
          />
        </AppFlexBox>
      </VaultPaper>
    );
  }

  return (
    <VaultPaper sx={{ marginBottom: "24px" }}>
      <SummaryWrapper>
        <Typography variant="h3" sx={{ fontSize: "16px" }}>
          {isTfVaultType
            ? `Percentage Yield Calculator for ${getPeriodInDays(
                tfVaultDepositEndDate,
                tfVaultLockEndDate
              )} days deposit`
            : "Annual Percentage Yield (APY) Calculator"}
        </Typography>
      </SummaryWrapper>
      <AppFlexBox mt="12px" sx={{ flexDirection: "row", gap: "20px" }}>
        <CalculatorInputWrapper>
          <AppFormLabelRow>
            <AppFormLabelV2>I have</AppFormLabelV2>
          </AppFormLabelRow>
          <CalculatorTextField
            error={!!(tokenAmount && isNaN(tokenAmount as unknown as number))}
            id="outlined-helperText"
            placeholder={"0"}
            helperText={
              <>
                {!!(tokenAmount && isNaN(tokenAmount as unknown as number)) && (
                  <AppFormInputErrorWrapper>
                    <InfoIcon
                      sx={{
                        float: "left",
                        width: "14px",
                        height: "14px",
                        marginRight: "0",
                      }}
                    />
                    <Box
                      component={"span"}
                      sx={{ fontSize: "12px", paddingLeft: "6px" }}
                    >
                      Deposit value must be greater than 0
                    </Box>
                  </AppFormInputErrorWrapper>
                )}
              </>
            }
            value={tokenAmount}
            type="number"
            onChange={onChange}
          />
          <CalculatorUsdIndicator>{`$${formatNumber(
            BigNumber(tokenAmount || 0)
              .multipliedBy(fxdPrice)
              .dividedBy(10 ** 18)
              .toNumber()
          )}`}</CalculatorUsdIndicator>
          <InputTokenLabel tokenSymbol={token?.symbol || ""} />
        </CalculatorInputWrapper>
        <CalculatorInputWrapper>
          <AppFormLabelRow>
            <AppFormLabelV2>Estimated earning</AppFormLabelV2>
          </AppFormLabelRow>
          <CalculatorTextField
            disabled
            id="outlined-helperText"
            placeholder={"0"}
            value={`+ ${estimatedEarning} ${token?.symbol}`}
            type="string"
          />
          <CalculatorUsdIndicator>{`$${formatNumber(
            BigNumber(estimatedEarning || 0)
              .multipliedBy(fxdPrice)
              .dividedBy(10 ** 18)
              .toNumber()
          )}`}</CalculatorUsdIndicator>
        </CalculatorInputWrapper>
      </AppFlexBox>
    </VaultPaper>
  );
};

export default memo(VaultProfitCalculator);
