import { Typography, TypographyProps } from "@mui/material";

export * from "apps/dex/theme/components";

export const TYPE = {
  main(props: TypographyProps) {
    return <Typography fontWeight={500} color={"#4F658C"} {...props} />;
  },
  link(props: TypographyProps) {
    return <Typography fontWeight={500} color={"#253656"} {...props} />;
  },
  black(props: TypographyProps) {
    return <Typography fontWeight={500} color={"#0E0F15"} {...props} />;
  },
  white(props: TypographyProps) {
    return <Typography fontWeight={500} color={"#ffffff"} {...props} />;
  },
  body(props: TypographyProps) {
    return (
      <Typography fontWeight={400} fontSize={16} color={"#ffffff"} {...props} />
    );
  },
  largeHeader(props: TypographyProps) {
    return <Typography fontWeight={600} fontSize={24} {...props} />;
  },
  mediumHeader(props: TypographyProps) {
    return <Typography fontWeight={500} fontSize={20} {...props} />;
  },
  subHeader(props: TypographyProps) {
    return <Typography fontWeight={400} fontSize={14} {...props} />;
  },
  small(props: TypographyProps) {
    return <Typography fontWeight={500} fontSize={11} {...props} />;
  },
  blue(props: TypographyProps) {
    return <Typography fontWeight={500} color={"#2172E5"} {...props} />;
  },
  gray(props: TypographyProps) {
    return <Typography fontWeight={500} color={"#43FFF6"} {...props} />;
  },
  italic(props: TypographyProps) {
    return (
      <Typography
        fontWeight={500}
        fontSize={12}
        fontStyle={"italic"}
        color={"#4F658C"}
        {...props}
      />
    );
  },
  error({ error, ...props }: { error: boolean } & TypographyProps) {
    return (
      <Typography
        fontWeight={500}
        color={error ? "#FD4040" : "#4F658C"}
        {...props}
      />
    );
  },
};
