import { styled } from "@mui/material/styles";
import { Paper } from "@mui/material";

export const BasePaper = styled(Paper)`
  background: #132340;
  border: 1px solid #2c4066;
  border-radius: 16px;
  padding: 24px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 16px;
  }
`;
export const BasePreviewModalPaper = styled(BasePaper)`
  padding: 0;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    border-radius: 12px;
  }
`;
