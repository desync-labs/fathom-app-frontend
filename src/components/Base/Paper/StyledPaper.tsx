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

export const BaseTooltipPaper = styled(Paper)`
  border-radius: 8px;
  background: #2a3e5a;
  box-shadow: 0 12px 32px 0 rgba(0, 7, 21, 0.5);
  padding: 10px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 5px 5px 5px 10px;
  }
  .MuiListItem-root {
    > * {
      color: #fff;
    }
  }
`;
