import { ReactNode } from "react";
import { Container, styled } from "@mui/material";

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    gap: 20px;
  }
`;

const BasePageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <StyledContainer
      maxWidth="lg"
      sx={{
        mt: 4,
        mb: 4,
      }}
    >
      {children}
    </StyledContainer>
  );
};

export default BasePageContainer;
