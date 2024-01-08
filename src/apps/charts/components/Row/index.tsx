import styled from "styled-components";
import { Box } from "rebass/styled-components";

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

export const RowBetween = styled(Row)`
  justify-content: space-between;
`;

export const AutoRow = styled(Row)<{
  gap?: string;
}>`
  flex-wrap: ${({ wrap }) => wrap ?? "nowrap"};
  margin: -${({ gap }) => gap};
  & > * {
    margin: ${({ gap }) => gap} !important;
  }
`;

export const RowFixed = styled(Row)`
  width: fit-content;
`;

export const TableHeaderBox = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  text-transform: uppercase;
  font-size: 11px;
`;

export default Row;
