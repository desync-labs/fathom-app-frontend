import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  styled,
} from "@mui/material";

export const BaseAccordion = styled(Accordion)`
  &.Mui-expanded {
    margin: 0;
  }
  &.MuiAccordion-root {
    &:before {
      opacity: 0;
    }
  }
`;
export const BaseAccordionTxGroupSummary = styled(AccordionSummary)`
  height: 56px;
  border-bottom: 1px solid #3d5580;
  padding: 0 24px;

  &.Mui-expanded {
    min-height: unset;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 0 16px;
  }
`;
export const BaseAccordionTxGroupDate = styled("div")`
  color: #b7c8e5;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
`;
export const BaseAccordionTxGroupDetails = styled(AccordionDetails)`
  padding: 0;
`;
