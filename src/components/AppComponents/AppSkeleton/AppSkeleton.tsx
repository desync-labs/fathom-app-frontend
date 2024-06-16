import { Skeleton, styled } from "@mui/material";
import { FC } from "react";

export const CustomSkeleton = styled(Skeleton)`
  background-color: #2536564a;
`;

type StatsValueSkeletonProps = {
  width?: number | string;
  height?: number | string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  animation?: "pulse" | "wave" | false;
  isMobile?: boolean;
};

export const StatsValueSkeleton: FC<StatsValueSkeletonProps> = ({
  width = 200,
  height = 28,
  variant = "rounded",
  animation = "wave",
  isMobile = false,
}) => {
  return (
    <Skeleton
      variant={variant}
      animation={animation}
      width={width}
      height={height}
      sx={{ bgcolor: "#2536564a", marginTop: isMobile ? "0" : "7px" }}
    />
  );
};

export const AppSkeletonValue = styled(Skeleton)`
  background-color: #8ea4cc26;
`;
