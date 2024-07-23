import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  ListItemText,
  styled,
  Typography,
} from "@mui/material";
import BigNumber from "bignumber.js";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";

import { formatNumber, formatPercentage } from "utils/format";
import useOpenPositionContext from "context/openPosition";
import useOpenPositionAiAssist from "hooks/Positions/useOpenPositionAiAssist";

import BaseDateRangePicker from "components/Base/Form/PeriodInput";
import { BaseSummary } from "components/Base/Typography/StyledTypography";
import { BaseButtonSecondary } from "components/Base/Buttons/StyledButtons";
import { CustomSkeleton } from "components/Base/Skeletons/StyledSkeleton";
import {
  BaseDialogFormInfoWrapper,
  BaseFormInfoList,
} from "components/Base/Form/StyledForm";
import {
  InfoListItem,
  ListTitleWrapper,
} from "components/Positions/OpenPosition/OpenPositionInfo";
import { BaseWarningBox } from "components/Base/Boxes/StyledBoxes";
import { InfoIcon } from "components/Governance/Propose";

const ShowAiAccordion = styled(Accordion)`
  background: transparent;
  box-shadow: none;
  &:before {
    display: none;
  }
  &.Mui-expanded {
    margin: 0;
  }
  & .MuiAccordionDetails-root {
    padding: 0;
  }
`;

const ShowAiSuggestionButton = styled(AccordionSummary)`
  &.MuiAccordionSummary-root {
    font-size: 15px;
    font-weight: 600;
    min-height: 20px;
    margin-top: 8px;
    padding: 0;

    &.Mui-expanded {
      min-height: 20px;
    }
  }

  & .MuiAccordionSummary-content {
    justify-content: flex-end;
    margin: 0 8px 0;

    &.Mui-expanded {
      margin: 0 8px 0;
    }
  }
`;

const OpenPositionAiAssist = () => {
  const { pool, fathomToken, setAiPredictionCollateral } =
    useOpenPositionContext();

  const {
    isAiSuggestionOpen,
    range,
    pricesPrediction,
    minPricePrediction,
    loadingPricePrediction,
    recommendCollateralAmount,
    handleChangeRange,
    handleAiSuggestionOpen,
    handleApplyAiRecommendation,
  } = useOpenPositionAiAssist(pool, fathomToken, setAiPredictionCollateral);

  return (
    <ShowAiAccordion
      expanded={isAiSuggestionOpen === "panel1"}
      onChange={handleAiSuggestionOpen("panel1")}
    >
      <ShowAiSuggestionButton
        expandIcon={
          isAiSuggestionOpen ? <RemoveRoundedIcon /> : <AddRoundedIcon />
        }
        aria-controls="panel1-content"
        id="panel1-header"
      >
        AI Suggestion
      </ShowAiSuggestionButton>
      <AccordionDetails>
        <BaseDialogFormInfoWrapper>
          <BaseDateRangePicker
            range={range}
            handleChangeRange={handleChangeRange}
          />
          <BaseSummary>Price Prediction</BaseSummary>
          <Divider />
          <BaseFormInfoList>
            <InfoListItem
              alignItems="flex-start"
              secondaryAction={
                <>
                  {loadingPricePrediction || pricesPrediction["1m"] === null ? (
                    <CustomSkeleton animation={"wave"} height={20} width={50} />
                  ) : (
                    `$${formatPercentage(pricesPrediction["1m"])}`
                  )}
                </>
              }
            >
              <ListItemText
                primary={
                  <ListTitleWrapper>Collateral (1-Month)</ListTitleWrapper>
                }
              />
            </InfoListItem>
            {range > 30 && (
              <InfoListItem
                alignItems="flex-start"
                secondaryAction={
                  <>
                    {loadingPricePrediction ||
                    pricesPrediction["2m"] === null ? (
                      <CustomSkeleton
                        animation={"wave"}
                        height={20}
                        width={50}
                      />
                    ) : (
                      `$${formatPercentage(pricesPrediction["2m"])}`
                    )}
                  </>
                }
              >
                <ListItemText
                  primary={
                    <ListTitleWrapper>Collateral (2-Month)</ListTitleWrapper>
                  }
                />
              </InfoListItem>
            )}
            {range > 60 && (
              <InfoListItem
                alignItems="flex-start"
                secondaryAction={
                  <>
                    {loadingPricePrediction ||
                    pricesPrediction["3m"] === null ? (
                      <CustomSkeleton
                        animation={"wave"}
                        height={20}
                        width={50}
                      />
                    ) : (
                      `$${formatPercentage(pricesPrediction["3m"])}`
                    )}
                  </>
                }
              >
                <ListItemText
                  primary={
                    <ListTitleWrapper>Collateral (3-Month)</ListTitleWrapper>
                  }
                />
              </InfoListItem>
            )}
            {range > 90 && (
              <InfoListItem
                alignItems="flex-start"
                secondaryAction={
                  <>
                    {loadingPricePrediction ||
                    pricesPrediction["6m"] === null ? (
                      <CustomSkeleton
                        animation={"wave"}
                        height={20}
                        width={50}
                      />
                    ) : (
                      `$${formatPercentage(pricesPrediction["6m"])}`
                    )}
                  </>
                }
              >
                <ListItemText
                  primary={
                    <ListTitleWrapper>Collateral (6-Month)</ListTitleWrapper>
                  }
                />
              </InfoListItem>
            )}
          </BaseFormInfoList>
          <Divider />
          <BaseFormInfoList>
            <InfoListItem
              alignItems="flex-start"
              secondaryAction={
                <>
                  {loadingPricePrediction || minPricePrediction === null ? (
                    <CustomSkeleton animation={"wave"} height={20} width={60} />
                  ) : (
                    `$${formatPercentage(minPricePrediction)}`
                  )}
                </>
              }
            >
              <ListItemText
                primary={
                  <ListTitleWrapper>Lowest collateral price</ListTitleWrapper>
                }
              />
            </InfoListItem>
            <InfoListItem
              alignItems="flex-start"
              secondaryAction={
                <>
                  {loadingPricePrediction ||
                  recommendCollateralAmount === null ? (
                    <CustomSkeleton animation={"wave"} height={20} width={60} />
                  ) : (
                    `${formatNumber(
                      BigNumber(recommendCollateralAmount).toNumber()
                    )} ${pool?.poolName}`
                  )}
                </>
              }
            >
              <ListItemText
                primary={
                  <ListTitleWrapper>
                    Collateralize to Avoid Liquidation
                  </ListTitleWrapper>
                }
              />
            </InfoListItem>
          </BaseFormInfoList>
          {BigNumber(fathomToken || "0").isLessThanOrEqualTo("0") && (
            <BaseWarningBox mb={2}>
              <InfoIcon
                sx={{ width: "16px", color: "#F5953D", height: "16px" }}
              />
              <Typography>
                Enter the desired borrowing amount to get AI suggestions
              </Typography>
            </BaseWarningBox>
          )}
          <BaseButtonSecondary
            disabled={
              loadingPricePrediction ||
              recommendCollateralAmount === null ||
              BigNumber(recommendCollateralAmount).isLessThanOrEqualTo("0") ||
              range <= 0
            }
            onClick={handleApplyAiRecommendation}
            sx={{ width: "100%", marginTop: "5px" }}
          >
            Apply AI Recommendation
          </BaseButtonSecondary>
        </BaseDialogFormInfoWrapper>
      </AccordionDetails>
    </ShowAiAccordion>
  );
};
export default OpenPositionAiAssist;
