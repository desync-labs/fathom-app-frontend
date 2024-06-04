import { Alert, AlertProps } from "@mui/material";
import { FC } from "react";

export const Warning: FC<AlertProps> = ({ children, sx, ...rest }) => {
  const styles = { mt: 4, alignItems: "center", width: "100%", ...sx };

  return (
    <Alert sx={styles} {...rest}>
      {children}
    </Alert>
  );
};
