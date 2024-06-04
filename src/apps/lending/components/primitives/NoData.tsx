import Typography, { TypographyProps } from "@mui/material/Typography";
import { ElementType } from "react";

export const NoData = <C extends ElementType>(
  props: TypographyProps<C, { component?: C }>
) => {
  return <Typography {...props}>—</Typography>;
};
