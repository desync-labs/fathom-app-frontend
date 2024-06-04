import { Box, styled } from "@mui/material";

const Column = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

export const AutoColumn = styled(Box)<{ gap?: string; justify?: string }>`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: ${({ gap }) =>
    (gap === "sm" && "8px") ||
    (gap === "md" && "12px") ||
    (gap === "lg" && "24px") ||
    gap};
  justify-items: ${({ justify }) => justify && justify};
  width: 100%;
`;

export default Column;
