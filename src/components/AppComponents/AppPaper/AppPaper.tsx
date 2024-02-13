import { Paper as MuiPaper } from "@mui/material";
import { styled } from "@mui/material/styles";

export const AppPaper = styled(MuiPaper)`
  background: #1d2d49;
  border: 1px solid #101d32;
  border-radius: 8px;
`;

export const StableSwapPaper = styled(AppPaper)`
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  background: #131f35;
  border: 1px solid #253656;
  border-radius: 16px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    border-radius: 0;
  }
`;
