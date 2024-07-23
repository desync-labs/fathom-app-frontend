import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  ListItemText,
  styled,
} from "@mui/material";
import {
  BaseDialogFormInfoWrapper,
  BaseFormInfoList,
} from "../../Base/Form/StyledForm";
import { InfoListItem, ListTitleWrapper } from "./OpenPositionInfo";
import { formatNumber, formatPercentage } from "utils/format";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import BaseDateRangePicker from "../../Base/Form/PeriodInput";
import { BaseSummary } from "../../Base/Typography/StyledTypography";
import { BaseButtonSecondary } from "../../Base/Buttons/StyledButtons";
import useOpenPositionAiAssist from "../../../hooks/Positions/useOpenPositionAiAssist";
import useOpenPositionContext from "../../../context/openPosition";
import { CustomSkeleton } from "../../Base/Skeletons/StyledSkeleton";
import BigNumber from "bignumber.js";

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
    liquidationCollateralAmount,
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
            <InfoListItem
              alignItems="flex-start"
              secondaryAction={
                <>
                  {loadingPricePrediction || pricesPrediction["2m"] === null ? (
                    <CustomSkeleton animation={"wave"} height={20} width={50} />
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
            <InfoListItem
              alignItems="flex-start"
              secondaryAction={
                <>
                  {loadingPricePrediction || pricesPrediction["3m"] === null ? (
                    <CustomSkeleton animation={"wave"} height={20} width={50} />
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
            <InfoListItem
              alignItems="flex-start"
              secondaryAction={
                <>
                  {loadingPricePrediction || pricesPrediction["6m"] === null ? (
                    <CustomSkeleton animation={"wave"} height={20} width={50} />
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
                  liquidationCollateralAmount === null ? (
                    <CustomSkeleton animation={"wave"} height={20} width={60} />
                  ) : (
                    `${formatNumber(
                      BigNumber(liquidationCollateralAmount).toNumber()
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
          <BaseButtonSecondary
            disabled={
              liquidationCollateralAmount === null || loadingPricePrediction
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
