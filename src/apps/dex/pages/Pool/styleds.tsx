import { Box, styled, Typography } from "@mui/material";

export const Wrapper = styled(Box)`
  position: relative;
  padding: 1rem;
`;

export const ClickableText = styled(Typography)`
  :hover {
    cursor: pointer;
  }
`;
export const MaxButton = styled("button")<{ width: string }>`
  padding: 0.5rem 1rem;
  background-color: #43fff6;
  border: 1px solid #22354f;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin: 0.25rem;
  overflow: hidden;
  color: #253656;
  :hover {
    border: 1px solid #253656;
  }
  :focus {
    border: 1px solid #253656;
    outline: none;
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    padding: 0.25rem 0.5rem;
  }
`;

export const Dots = styled("span")`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: ".";
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: ".";
    }
    33% {
      content: "..";
    }
    66% {
      content: "...";
    }
  }
`;
