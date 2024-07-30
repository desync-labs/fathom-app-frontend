import { Box, styled } from "@mui/material";

const Row = styled(Box)<{
  align?: string;
  padding?: string;
  border?: string;
  borderRadius?: string;
  justify?: string;
}>`
  width: 100%;
  display: flex;
  align-items: ${({ align }) => (align ? align : "center")};
  padding: ${({ padding }) => (padding ? padding : "0")};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
  justify-content: ${({ justify }) => justify};
`;

export const RowBetween = styled(Row)<{
  gap?: string;
}>`
  justify-content: space-between;
  gap: ${({ gap }) => gap};
`;

export const AutoRow = styled(Row)<{
  gap?: string;
  wrap?: string;
}>`
  flex-wrap: ${({ wrap }) => wrap ?? "nowrap"};
  margin: -${({ gap }) => gap};
  & > * {
    margin: ${({ gap }) => gap} !important;
  }
`;

export const RowFixed = styled(Row)`
  width: fit-content;
  align-items: center;
`;

export const TableHeaderBox = styled(Box)`
  color: #8ea4cc;
  text-transform: uppercase;
  font-size: 11px;
  font-weight: 600;
`;

export default Row;
