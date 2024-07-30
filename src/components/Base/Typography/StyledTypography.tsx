import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

export const BaseSummary = styled(Typography)`
  color: #b7c8e5;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 12px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 14px;
  }
`;

export const NoResults = styled(Typography)`
  color: #6d86b2;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  background: #132340;
  border-radius: 8px;
  padding: 16px 24px;
`;
