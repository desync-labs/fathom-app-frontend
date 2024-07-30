import { ReactNode } from "react";
import { Box, styled } from "@mui/material";

export const BodyWrapper = styled(Box)`
  position: relative;
  max-width: 600px;
  width: 100%;
  background: #132340;
  border: 1px solid #2c4066;
  border-radius: 16px;
  padding-bottom: 1rem;
`;

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
const AppBody = ({ children }: { children: ReactNode }) => {
  return <BodyWrapper>{children}</BodyWrapper>;
};

export default AppBody;
