import { SyntheticEvent, useState } from "react";
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
import { formatNumber } from "utils/format";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import BaseDateRangePicker from "../../Base/Form/PeriodInput";
import { BaseSummary } from "../../Base/Typography/StyledTypography";

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
  const [isAiSuggestionOpen, setIsAiSuggestionOpen] = useState<string | false>(
    false
  );
  const [range, setRange] = useState<number>(1);

  const handleChangeRange = (range: number) => {
    setRange(range);
  };

  const handleAiSuggestionOpen =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setIsAiSuggestionOpen(isExpanded ? panel : false);
    };
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
              secondaryAction={`$${formatNumber(1000)}`}
            >
              <ListItemText
                primary={
                  <ListTitleWrapper>Collateral (1-Month)</ListTitleWrapper>
                }
              />
            </InfoListItem>
            <InfoListItem
              alignItems="flex-start"
              secondaryAction={`$${formatNumber(2000)}`}
            >
              <ListItemText
                primary={
                  <ListTitleWrapper>Collateral (2-Month)</ListTitleWrapper>
                }
              />
            </InfoListItem>
            <InfoListItem
              alignItems="flex-start"
              secondaryAction={`$${formatNumber(3000)}`}
            >
              <ListItemText
                primary={
                  <ListTitleWrapper>Collateral (3-Month)</ListTitleWrapper>
                }
              />
            </InfoListItem>
          </BaseFormInfoList>
          <Divider />
          <BaseFormInfoList>
            <InfoListItem
              alignItems="flex-start"
              secondaryAction={`$${formatNumber(40)}`}
            >
              <ListItemText
                primary={
                  <ListTitleWrapper>Lowest collateral price</ListTitleWrapper>
                }
              />
            </InfoListItem>
            <InfoListItem
              alignItems="flex-start"
              secondaryAction={`${formatNumber(1500)} XDC`}
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
        </BaseDialogFormInfoWrapper>
      </AccordionDetails>
    </ShowAiAccordion>
  );
};
export default OpenPositionAiAssist;
