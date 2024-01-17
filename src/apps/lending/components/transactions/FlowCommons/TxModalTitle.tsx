import { Typography } from "@mui/material";
import { FC, ReactNode } from "react";

export type TxModalTitleProps = {
  title: ReactNode;
  symbol?: string;
};

export const TxModalTitle: FC<TxModalTitleProps> = ({ title, symbol }) => {
  return (
    <Typography
      variant="h2"
      sx={(theme) => ({ mb: 6, color: theme.palette.primary.main })}
    >
      {title} {symbol ?? ""}
    </Typography>
  );
};
