import { ReactNode } from "react";
import { Container, styled, SxProps } from "@mui/material";

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    gap: 20px;
  }
`;

const BasePageContainer = ({
  children,
  sx,
}: {
  children: ReactNode;
  sx?: SxProps;
}) => {
  return (
    <StyledContainer
      maxWidth="lg"
      sx={{
        mt: 4,
        mb: 4,
        ...sx,
      }}
    >
      {children}
    </StyledContainer>
  );
};

export default BasePageContainer;
