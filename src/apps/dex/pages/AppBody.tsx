import styled from "styled-components";
import { ReactNode } from "react";

export const BodyWrapper = styled.div`
  position: relative;
  max-width: 600px;
  width: 100%;
  background: ${({ theme }) => theme.bg1};
  border: 1px solid #253656;
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
