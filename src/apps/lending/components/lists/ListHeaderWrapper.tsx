import { Box, BoxProps } from "@mui/material";
import { FC, ReactNode } from "react";

interface ListHeaderWrapperProps extends BoxProps {
  px?: 2 | 3;
  children: ReactNode;
}

export const ListHeaderWrapper: FC<ListHeaderWrapperProps> = ({
  px = 2,
  children,
  ...rest
}) => {
  return (
    <Box
      {...rest}
      sx={{
        display: "flex",
        alignItems: "flex-end",
        px,
        pt: 2,
        pb: 0.5,
        position: "sticky",
        top: 0,
        zIndex: 100,
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        ...rest.sx,
      }}
    >
      {children}
    </Box>
  );
};
