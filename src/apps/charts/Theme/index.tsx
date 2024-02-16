import { Typography, TypographyProps } from "@mui/material";

export const TYPE = {
  main(props: TypographyProps) {
    return <Typography fontWeight={500} fontSize={14} {...props} />;
  },

  body(props: TypographyProps) {
    return <Typography fontWeight={400} fontSize={14} {...props} />;
  },

  green(props: TypographyProps) {
    return (
      <Typography fontWeight={400} fontSize={14} color={"#002F2D"} {...props} />
    );
  },

  small(props: TypographyProps) {
    return <Typography fontWeight={500} fontSize={11} {...props} />;
  },

  header(props: TypographyProps) {
    return <Typography fontWeight={600} {...props} />;
  },

  largeHeader(props: TypographyProps) {
    return <Typography fontWeight={500} fontSize={24} {...props} />;
  },

  light(props: TypographyProps) {
    return (
      <Typography fontWeight={400} color={"#6379a1"} fontSize={14} {...props} />
    );
  },
};
