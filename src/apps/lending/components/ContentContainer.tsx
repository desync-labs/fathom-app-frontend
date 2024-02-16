import { Box, Container } from "@mui/material";
import { FC, ReactNode } from "react";

interface ContentContainerProps {
  children: ReactNode;
}

export const ContentContainer: FC<ContentContainerProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        mt: { xs: "-32px", lg: "-46px", xl: "-44px", xxl: "-48px" },
      }}
    >
      <Container>{children}</Container>
    </Box>
  );
};
