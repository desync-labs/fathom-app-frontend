import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

export const BaseSummary = styled(Typography)`
  color: #b7c8e5;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 15px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 14px;
  }
`;
