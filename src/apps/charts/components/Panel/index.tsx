import { Box, styled } from "@mui/material";

const Panel = styled(Box)<{
  hover?: boolean;
  background?: boolean;
  area?: string;
  grouped?: boolean;
  rounded?: boolean;
  last?: boolean;
}>`
  position: relative;
  background-color: #1e2f4c;
  padding: 1.25rem;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 8px;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.05); /* box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.01), 0px 16px 24px rgba(0, 0, 0, 0.01), 0px 24px 32px rgba(0, 0, 0, 0.01); */
  :hover {
    cursor: ${({ hover }) => hover && "pointer"};
    border: ${({ hover }) => hover && "1px solid #565A69"};
  }
`;

export default Panel;
